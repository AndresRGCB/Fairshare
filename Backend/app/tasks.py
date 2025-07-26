from celery import Celery
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import SessionLocal
from app.models import Expense, RecurringExpense, InstallmentExpense

app = Celery("tasks", broker="redis://localhost:6379/0")

@app.task
def process_monthly_expenses():
    """Process recurring and installment expenses on the 1st of the month"""
    db: Session = SessionLocal()
    
    try:
        print("🚀 Running Monthly Expense Processing...")

        # 🔥 1️⃣ Process Recurring Expenses
        recurring_expenses = db.query(RecurringExpense).all()
        for recurring in recurring_expenses:
            new_expense = Expense(
                title=recurring.title,
                amount=recurring.amount,
                type="expense",
                is_recurring=True,
                recurring_frequency="monthly",
                is_installment=False,
                num_installments=None,
                notes="Auto-generated from recurring expenses",
                user_id=recurring.user_id,
                date=datetime.utcnow(),
                labels=[]  # Add labels if needed
            )
            db.add(new_expense)

        # 🔥 2️⃣ Process Installment Expenses
        installment_expenses = db.query(InstallmentExpense).filter(
            InstallmentExpense.completed_installments < InstallmentExpense.num_installments
        ).all()

        for installment in installment_expenses:
            # Calculate monthly installment amount
            monthly_amount = installment.amount / installment.num_installments

            # Create an expense entry for this installment
            new_expense = Expense(
                title=f"{installment.title} - Installment {installment.completed_installments + 1}/{installment.num_installments}",
                amount=monthly_amount,
                type="expense",
                is_recurring=False,
                recurring_frequency=None,
                is_installment=True,
                num_installments=installment.num_installments,
                notes="Auto-generated from installment expenses",
                user_id=installment.user_id,
                date=datetime.utcnow(),
                labels=[]  # Add labels if needed
            )
            db.add(new_expense)

            # Update installment progress
            installment.completed_installments += 1
            installment.completion_percentage = (installment.completed_installments / installment.num_installments) * 100
        
        db.commit()
        print("✅ Monthly Expense Processing Completed Successfully!")

    except Exception as e:
        db.rollback()
        print("🔥 Error processing monthly expenses:", e)
    finally:
        db.close()
