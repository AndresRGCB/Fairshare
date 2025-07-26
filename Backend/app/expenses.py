from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ExpenseCreate
from sqlalchemy import extract, func
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta
import logging
from app.auth import get_current_user
from app.redis_config import redis_client, get_cache_key
import json
from typing import Any

router = APIRouter(prefix="/api/expenses", tags=["Expenses"])

from app.models import Expense, Label, RecurringExpense, InstallmentExpense


router = APIRouter(prefix="/api/expenses", tags=["Expenses"])

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add this helper function at the top of your file
def serialize_datetime(obj: Any) -> str:
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, date):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

@router.post("/add")
def add_expense(
    expense_data: ExpenseCreate, 
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Verify user_id matches the token
        if expense_data.user_id != current_user['user_id']:
            raise HTTPException(status_code=403, detail="Not authorized to add expenses for this user")
            
        print("🚀 Incoming Expense Data:", expense_data.dict())
        print("📅 Received Date:", getattr(expense_data, 'date', 'Not provided'))

        # Adjust to UTC-6
        current_time = datetime.utcnow() - timedelta(hours=6)
        current_date = current_time.date()

        # Process labels from request
        labels_list = []
        if expense_data.labels:
            for label_data in expense_data.labels:
                existing_label = (
                    db.query(Label)
                    .filter(Label.user_id == expense_data.user_id, Label.name == label_data.name)
                    .first()
                )

                if not existing_label:
                    new_label = Label(
                        name=label_data.name,
                        color=label_data.color,
                        user_id=expense_data.user_id
                    )
                    db.add(new_label)
                    db.commit()
                    db.refresh(new_label)
                    existing_label = new_label

                labels_list.append({"name": existing_label.name, "color": existing_label.color})

        # Create new expense entry for regular expenses
        if expense_data.is_recurring.lower() != "yes" and expense_data.is_installment.lower() != "yes":
            new_expense = Expense(
                title=expense_data.title,
                amount=expense_data.amount,
                type=expense_data.type,
                is_recurring=False,
                is_installment=False,
                num_installments=expense_data.num_installments,
                notes=expense_data.notes,
                user_id=expense_data.user_id,
                labels=labels_list,
                date=getattr(expense_data, 'date', current_time)  # ✅ fallback if date is not provided
            )
            db.add(new_expense)
            db.commit()
            db.refresh(new_expense)

        # Handle Recurring Expenses
        elif expense_data.is_recurring.lower() == "yes":
            new_recurring_expense = RecurringExpense(
                user_id=expense_data.user_id,
                title=expense_data.title,
                amount=expense_data.amount,
                created_at=current_time,
                is_active=True,
                labels=labels_list
            )
            db.add(new_recurring_expense)

        # Handle Installments
        elif expense_data.is_installment.lower() == "yes":
            begin_date = getattr(expense_data, 'date', current_date)
            end_date = begin_date + relativedelta(months=expense_data.num_installments - 1)

            new_installment_expense = InstallmentExpense(
                user_id=expense_data.user_id,
                title=expense_data.title,
                amount=expense_data.amount,
                is_installment=True,
                is_active=True,
                num_installments=expense_data.num_installments,
                begin_date=begin_date,
                end_date=end_date,
                labels=labels_list
            )
            db.add(new_installment_expense)

        db.commit()

        # Clear all cache instead of just user-specific cache
        redis_client.flushall()
        logger.info("Cache cleared after adding expense")

        return {"message": "Expense added successfully"}

    except Exception as e:
        db.rollback()
        print("🔥 Error saving expense:", e)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")



    
    

@router.get("/")
def get_expenses(
    page: int = Query(1, alias="page", ge=1),
    items_per_page: int = Query(10, alias="items_per_page", ge=1, le=100),
    date_filter: str = Query("month", alias="date_filter"),
    expense_type: str = Query("single", alias="expense_type"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Generate cache key
        cache_key = get_cache_key("expenses", current_user['user_id'], 
            page=page, 
            items_per_page=items_per_page,
            date_filter=date_filter,
            expense_type=expense_type
        )
        
        # Try to get from cache
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)

        today = datetime.utcnow().date()
        expenses = []
        total_items = 0

        if expense_type == "recurring":
            # Get recurring expenses
            query = db.query(RecurringExpense).order_by(RecurringExpense.created_at.desc())
            recurring_expenses = query.all()
            
            for expense in recurring_expenses:
                amount = expense.amount
                if date_filter == "today":
                    amount = round(expense.amount / 30, 2)
                elif date_filter == "year":
                    amount = round(expense.amount * 12, 2)

                expenses.append({
                    "id": expense.id,
                    "title": expense.title,
                    "amount": amount,
                    "created_at": expense.created_at.isoformat() if expense.created_at else None,  # Convert to ISO format
                    "type": "recurring",
                    "is_active": expense.is_active,
                    "labels": expense.labels
                })

        elif expense_type == "installment":
            # Get installment expenses
            query = db.query(InstallmentExpense).order_by(InstallmentExpense.begin_date.desc())
            installment_expenses = query.all()
            
            for expense in installment_expenses:
                if expense.begin_date <= today <= expense.end_date:
                    # Remove the monthly division, just use the full amount
                    
                    amount = expense.amount  # Full amount for year view too

                    expenses.append({
                        "id": expense.id,
                        "title": expense.title,
                        "amount": amount,
                        "begin_date": expense.begin_date.isoformat() if expense.begin_date else None,
                        "end_date": expense.end_date.isoformat() if expense.end_date else None,
                        "type": "installment",
                        "is_active": expense.is_active,
                        "labels": expense.labels
                    })

        else:  # single expenses
            # Base query for single expenses
            query = db.query(Expense).filter(
                Expense.is_recurring == False,
                Expense.is_installment == False
            )

            # Apply date filter only for single expenses
            if date_filter == "today":
                query = query.filter(func.date(Expense.date) == today)
            elif date_filter == "month":
                query = query.filter(
                    extract("year", Expense.date) == today.year,
                    extract("month", Expense.date) == today.month
                )
            elif date_filter == "year":
                query = query.filter(extract("year", Expense.date) == today.year)
                
            # Sort by date, newest first
            query = query.order_by(Expense.date.desc())

            single_expenses = query.all()
            expenses = [{
                "id": expense.id,
                "title": expense.title,
                "amount": expense.amount,
                "date": expense.date,
                "notes": expense.notes,
                "labels": expense.labels,
                "type": "single"
            } for expense in single_expenses]

        # Apply pagination
        total_items = len(expenses)
        total_pages = (total_items + items_per_page - 1) // items_per_page
        start_idx = (page - 1) * items_per_page
        end_idx = start_idx + items_per_page
        paginated_expenses = expenses[start_idx:end_idx]

        # Add logging to debug the response
        print("📊 Sending expenses with labels:", paginated_expenses)

        response_data = {
            "expenses": paginated_expenses,
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page
        }

        # Store in cache using custom JSON encoder
        redis_client.setex(
            cache_key,
            300,  # 5 minutes
            json.dumps(response_data, default=serialize_datetime)  # Add the serializer here
        )

        return response_data

    except Exception as e:
        print("🔥 Error fetching expenses:", e)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    
    
    
    
# DELETE endpoint with type
@router.delete("/delete/{expense_type}/{expense_id}")
def delete_expense(
    expense_id: int,
    expense_type: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"🔍 Attempting to delete {expense_type} expense with ID: {expense_id}")
        deleted = False

        if expense_type == "recurring":
            expense = db.query(RecurringExpense).filter(RecurringExpense.id == expense_id).first()
            if expense:
                db.delete(expense)
                deleted = True
                logger.info(f"✅ Deleted RecurringExpense: ID {expense_id}")

        elif expense_type == "installment":
            expense = db.query(InstallmentExpense).filter(InstallmentExpense.id == expense_id).first()
            if expense:
                db.delete(expense)
                deleted = True
                logger.info(f"✅ Deleted InstallmentExpense: ID {expense_id}")

        elif expense_type == "single":
            expense = db.query(Expense).filter(Expense.id == expense_id).first()
            if expense:
                db.delete(expense)
                deleted = True
                logger.info(f"✅ Deleted Single Expense: ID {expense_id}")

        if not deleted:
            logger.warning(f"❌ Expense not found for type '{expense_type}' with ID: {expense_id}")
            raise HTTPException(status_code=404, detail="Expense not found in specified table")

        db.commit()

        # Clear all cache instead of pattern matching
        redis_client.flushall()
        logger.info("Cache cleared after deleting expense")

        return {"message": "Expense deleted successfully"}

    except Exception as e:
        db.rollback()
        logger.error(f"🔥 Error deleting expense {expense_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

