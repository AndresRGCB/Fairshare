from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from app.database import get_db
from app.models import RecurringExpense, Expense, InstallmentExpense
from app.auth import get_current_user
from app.redis_config import redis_client, get_cache_key
import json

router = APIRouter(prefix="/api/graphs", tags=["Graphs"])


def calculate_carryover_for_date(db: Session, user_id: int, target_date: datetime.date):
    """Helper function to calculate carryover for a specific date"""
    days_in_month = (datetime(target_date.year, target_date.month % 12 + 1, 1) - datetime(target_date.year, target_date.month, 1)).days
    
    # Get recurring expenses - daily portion (only active)
    recurring_expenses = db.query(RecurringExpense).filter(
        RecurringExpense.user_id == user_id,
        RecurringExpense.is_active == True  # Add active filter
    ).all()
    
    total_daily_recurring_expense = 0.0
    total_daily_income = 0.0
    
    for expense in recurring_expenses:
        daily_amount = expense.amount / days_in_month
        if expense.amount < 0:
            total_daily_recurring_expense += daily_amount
        else:
            total_daily_income += daily_amount

    # Get installment expenses - daily portion (only active)
    installment_expenses = db.query(InstallmentExpense).filter(
        InstallmentExpense.user_id == user_id,
        InstallmentExpense.is_active == True  # Add active filter
    ).all()
    
    total_daily_installment_expense = 0.0
    
    for expense in installment_expenses:
        if expense.begin_date <= target_date <= expense.end_date:
            # Calculate days between start and end
            total_days = (expense.end_date - expense.begin_date).days + 1
            daily_amount = expense.amount / total_days
            total_daily_installment_expense += daily_amount

    # Get single expenses for just this specific date
    single_expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == user_id,
            func.date(Expense.date) == target_date
        )
        .all()
    )
    
    total_single_expense_today = sum(expense.amount for expense in single_expenses)

    # Calculate carryover for just this date
    daily_carryover = (
        total_daily_income + 
        total_daily_recurring_expense + 
        total_daily_installment_expense + 
        total_single_expense_today
    )
    
    return round(daily_carryover, 2)

@router.get("/daily")
def get_daily_financials(
    user_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user_id matches the token
    if user_id != current_user['user_id']:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's data")
    
    try:
        # Generate cache key
        cache_key = get_cache_key("daily_financials", user_id)
        
        # Try to get from cache
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)

        # Adjust for UTC-6
        current_time = datetime.utcnow() - timedelta(hours=6)
        today = current_time.date()
        days_in_month = (datetime(today.year, today.month % 12 + 1, 1) - datetime(today.year, today.month, 1)).days
        days_passed = today.day

        # Get all active recurring expenses
        recurring_expenses = (
            db.query(RecurringExpense)
            .filter(
                RecurringExpense.user_id == user_id,
                RecurringExpense.is_active == True  # Add active filter
            )
            .all()
        )
        
        recurring_expenses_data = {}
        total_daily_recurring_expense = 0.0
        incomes_data = {}
        total_income = 0.0
        
        for expense in recurring_expenses:
            daily_cost = expense.amount / days_in_month
            if expense.amount < 0:
                recurring_expenses_data[expense.title] = round(daily_cost, 2)
                total_daily_recurring_expense += daily_cost
            else:
                incomes_data[expense.title] = round(daily_cost, 2)
                total_income += daily_cost
        
        # Get all active installment expenses
        installment_expenses = db.query(InstallmentExpense).filter(
            InstallmentExpense.user_id == user_id,
            InstallmentExpense.is_active == True  # Add active filter
        ).all()
        
        installment_expenses_data = {}
        total_daily_installment_expense = 0.0
        
        for expense in installment_expenses:
            if expense.begin_date <= today <= expense.end_date:
                # Calculate days between start and end
                total_days = (expense.end_date - expense.begin_date).days + 1
                daily_cost = expense.amount / total_days
                installment_expenses_data[expense.title] = round(daily_cost, 2)
                total_daily_installment_expense += daily_cost
        
        # Calculate carryover for each day in the current month up to today
        total_carryover = 0.0
        for day in range(1, days_passed + 1):
            current_date = today.replace(day=day)
            daily_carryover = calculate_carryover_for_date(db, user_id, current_date)
            total_carryover += daily_carryover
        
        # Calculate carryover history for the last 5 days
        carryover_history = []
        for i in range(5, -1, -1):  # 5 to 0, giving us last 5 days plus today
            target_date = today - timedelta(days=i)
            carryover = calculate_carryover_for_date(db, user_id, target_date)
            carryover_history.append({
                "date": target_date.strftime("%Y-%m-%d"),
                "carryover": carryover
            })
        
        # Get all single expenses for today (adjusted for UTC-6)
        single_expenses = (
            db.query(Expense)
            .filter(
                Expense.user_id == user_id,
                # Use BETWEEN to catch all expenses for the adjusted day
                Expense.date.between(
                    datetime.combine(today, datetime.min.time()),  # Start of day
                    datetime.combine(today, datetime.max.time())   # End of day
                )
            )
            .all()
        )
        
        single_expenses_data = {}
        total_single_expense = 0.0
        
        for expense in single_expenses:
            single_expenses_data[expense.title] = round(expense.amount, 2)
            total_single_expense += expense.amount
        
        response_data = {
            "recurring_expenses": {
                "daily_expenses": recurring_expenses_data,
                "total_daily_expense": round(total_daily_recurring_expense, 2)
            },
            "installment_expenses": {
                "daily_installment_expenses": installment_expenses_data,
                "total_daily_installment_expense": round(total_daily_installment_expense, 2)
            },
            "incomes": {
                "daily_incomes": incomes_data,
                "total_daily_income": round(total_income, 2)
            },
            "single_expenses": {
                "today_expenses": single_expenses_data if single_expenses_data else {},
                "total_today_expense": round(total_single_expense, 2)
            },
            "carryover": {
                "total_carryover_savings": round(total_carryover, 2),
                "carryover_history": carryover_history
            }
        }

        # Store in cache for 5 minutes
        redis_client.setex(
            cache_key,
            300,  # 5 minutes
            json.dumps(response_data)
        )

        return response_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/monthly")
def get_monthly_financials(
    user_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user_id matches the token
    if user_id != current_user['user_id']:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's data")
    
    try:
        # Generate cache key
        cache_key = get_cache_key("monthly_financials", user_id)
        
        # Try to get from cache
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)

        today = datetime.utcnow().date()
        first_day = today.replace(day=1)  # First day of current month
        last_day = (first_day + relativedelta(months=1) - timedelta(days=1))  # Last day of current month
        days_in_month = (last_day - first_day).days + 1

        # Initialize labels dictionary to track expenses by label
        labels_totals = {}

        # Get active recurring expenses
        recurring_expenses = db.query(RecurringExpense).filter(
            RecurringExpense.user_id == user_id,
            RecurringExpense.is_active == True  # Add active filter
        ).all()
        
        recurring_expenses_data = {}
        total_monthly_recurring_expense = 0.0
        incomes_data = {}
        total_income = 0.0
        
        for expense in recurring_expenses:
            if expense.amount < 0:
                recurring_expenses_data[expense.title] = round(expense.amount, 2)
                total_monthly_recurring_expense += expense.amount
                # Add to labels total
                if expense.labels:  # Check if labels exist
                    for label in expense.labels:
                        label_name = label.get('name')  # Get the name from the label dictionary
                        if label_name not in labels_totals:
                            labels_totals[label_name] = 0
                        labels_totals[label_name] += expense.amount
            else:
                incomes_data[expense.title] = round(expense.amount, 2)
                total_income += expense.amount

        # Get active installment expenses for this month
        installment_expenses = db.query(InstallmentExpense).filter(
            InstallmentExpense.user_id == user_id,
            InstallmentExpense.is_active == True,  # Add active filter
            InstallmentExpense.begin_date <= last_day,
            InstallmentExpense.end_date >= first_day
        ).all()
        
        installment_expenses_data = {}
        total_monthly_installment_expense = 0.0
        
        for expense in installment_expenses:
            # Calculate the portion of the installment for this month
            start = max(expense.begin_date, first_day)
            end = min(expense.end_date, last_day)
            days_active = (end - start).days + 1
            total_days = (expense.end_date - expense.begin_date).days + 1
            monthly_amount = (expense.amount / total_days) * days_active
            
            installment_expenses_data[expense.title] = round(monthly_amount, 2)
            total_monthly_installment_expense += monthly_amount
            # Add to labels total
            if expense.labels:  # Check if labels exist
                for label in expense.labels:
                    label_name = label.get('name')  # Get the name from the label dictionary
                    if label_name not in labels_totals:
                        labels_totals[label_name] = 0
                    labels_totals[label_name] += monthly_amount

        # Get single expenses for the month
        single_expenses = (
            db.query(Expense)
            .filter(
                Expense.user_id == user_id,
                func.date(Expense.date) >= first_day,
                func.date(Expense.date) <= last_day
            )
            .all()
        )
        
        single_expenses_data = {}
        total_monthly_single_expense = 0.0
        
        for expense in single_expenses:
            single_expenses_data[expense.title] = round(expense.amount, 2)
            total_monthly_single_expense += expense.amount
            # Add to labels total
            if expense.labels:  # Check if labels exist
                for label in expense.labels:
                    label_name = label.get('name')  # Get the name from the label dictionary
                    if label_name not in labels_totals:
                        labels_totals[label_name] = 0
                    labels_totals[label_name] += expense.amount

        # Calculate total expenses for percentages
        total_expenses = total_monthly_recurring_expense + total_monthly_installment_expense + total_monthly_single_expense
        
        # Calculate total amount across all labels first
        total_labels_amount = sum(abs(amount) for amount in labels_totals.values())
        
        # Format labels data with percentages based on total labels amount
        labels_data = [
            {
                "title": label_name,
                "amount": round(abs(amount), 2),  # Keep amount for reference
                "percentage": round((abs(amount) / total_labels_amount * 100), 2) if total_labels_amount > 0 else 0
            }
            for label_name, amount in labels_totals.items()
        ]

        # Sort labels by percentage in descending order
        labels_data = sorted(labels_data, key=lambda x: x['percentage'], reverse=True)

        # Calculate total income and budget left - we already have total_income from earlier
        budget_left = total_income + total_expenses

        response_data = {
            "recurring_expenses": {
                "monthly_expenses": recurring_expenses_data,
                "total_monthly_expense": round(total_monthly_recurring_expense, 2)
            },
            "installment_expenses": {
                "monthly_installment_expenses": installment_expenses_data,
                "total_monthly_installment_expense": round(total_monthly_installment_expense, 2)
            },
            "single_expenses": {
                "monthly_expenses": single_expenses_data,
                "total_monthly_expense": round(total_monthly_single_expense, 2)
            },
            "incomes": {
                "monthly_incomes": incomes_data,
                "total_monthly_income": round(total_income, 2)
            },
            "expenses_by_label": labels_data,
            "monthly_balance": {
                "total_income": round(total_income, 2),
                "total_expenses": round(total_expenses, 2),
                "budget_left": round(budget_left, 2)
            }
        }

        # Store in cache for 5 minutes
        redis_client.setex(
            cache_key,
            300,  # 5 minutes
            json.dumps(response_data)
        )

        return response_data
    
    except Exception as e:
        print("Error details:", str(e))
        print("Type of error:", type(e))
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
