import pytest
from datetime import datetime, timedelta
from app.models import RecurringExpense, InstallmentExpense, Expense, User
from app.auth import create_jwt_token

@pytest.fixture
def test_user(db_session):
    from app.auth import bcrypt
    hashed_password = bcrypt.hashpw("supersecret".encode(), bcrypt.gensalt()).decode()
    user = User(name="Graph Tester", email="graphtester@example.com", password=hashed_password, is_verified=True)
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def auth_headers(test_user):
    token = create_jwt_token(test_user.id, test_user.name)
    return {"Authorization": f"Bearer {token}"}

def test_get_daily_financials(client, db_session, test_user, auth_headers):
    today = datetime.utcnow().date()

    recurring = RecurringExpense(
        title="Rent",
        amount=-300.0,
        user_id=test_user.id,
        is_active=True,
        created_at=datetime.utcnow()
    )
    income = RecurringExpense(
        title="Salary",
        amount=1200.0,
        user_id=test_user.id,
        is_active=True,
        created_at=datetime.utcnow()
    )
    installment = InstallmentExpense(
        title="Laptop",
        amount=600.0,
        user_id=test_user.id,
        is_active=True,
        is_installment=True,
        num_installments=6,
        begin_date=today - timedelta(days=15),
        end_date=today + timedelta(days=150)
    )
    single = Expense(
        title="Coffee",
        amount=5.0,
        user_id=test_user.id,
        date=datetime.utcnow(),
        type="food"
    )

    db_session.add_all([recurring, income, installment, single])
    db_session.commit()

    response = client.get(f"/api/graphs/daily?user_id={test_user.id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "recurring_expenses" in data
    assert "carryover" in data

def test_get_monthly_financials(client, db_session, test_user, auth_headers):
    today = datetime.utcnow().date()

    recurring = RecurringExpense(
        title="Utilities",
        amount=-100.0,
        user_id=test_user.id,
        is_active=True,
        created_at=datetime.utcnow(),
        labels=[{"name": "Bills", "color": "red"}]
    )
    income = RecurringExpense(
        title="Side Hustle",
        amount=300.0,
        user_id=test_user.id,
        is_active=True,
        created_at=datetime.utcnow(),
        labels=[{"name": "Income", "color": "green"}]
    )
    installment = InstallmentExpense(
        title="Fridge",
        amount=1200.0,
        user_id=test_user.id,
        is_active=True,
        is_installment=True,
        num_installments=6,
        begin_date=today - timedelta(days=30),
        end_date=today + timedelta(days=150),
        labels=[{"name": "Home", "color": "blue"}]
    )
    single = Expense(
        title="Groceries",
        amount=200.0,
        user_id=test_user.id,
        date=datetime.utcnow(),
        labels=[{"name": "Food", "color": "orange"}],
        type="food"
    )

    db_session.add_all([recurring, income, installment, single])
    db_session.commit()

    response = client.get(f"/api/graphs/monthly?user_id={test_user.id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "monthly_balance" in data
    assert "expenses_by_label" in data