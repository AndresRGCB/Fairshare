import pytest
from datetime import datetime, timedelta
from app.models import User, Expense, RecurringExpense, InstallmentExpense
from app.auth import bcrypt
from fastapi.testclient import TestClient

@pytest.fixture
def test_user(db_session):
    hashed = bcrypt.hashpw("secret".encode(), bcrypt.gensalt()).decode()
    user = User(email="expensetester@example.com", name="Tester", password=hashed, is_verified=True)
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def auth_headers(client: TestClient, test_user):
    response = client.post("/api/auth/login", json={
        "email": test_user.email,
        "password": "secret"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_add_single_expense(client, test_user, auth_headers):
    payload = {
        "title": "Coffee",
        "amount": 3.5,
        "type": "food",
        "is_recurring": "no",
        "is_installment": "no",
        "num_installments": 1,
        "notes": "Morning coffee",
        "labels": [{"name": "Food", "color": "blue"}],
        "user_id": test_user.id
    }

    response = client.post("/api/expenses/add", json=payload, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Expense added successfully"

def test_add_and_get_recurring_expense(client, test_user, auth_headers):
    payload = {
        "title": "Netflix",
        "amount": 15.0,
        "type": "entertainment",
        "is_recurring": "yes",
        "is_installment": "no",
        "num_installments": 1,
        "notes": "Monthly subscription",
        "labels": [{"name": "Subs", "color": "red"}],
        "user_id": test_user.id
    }
    response = client.post("/api/expenses/add", json=payload, headers=auth_headers)
    assert response.status_code == 200

    response = client.get("/api/expenses/?expense_type=recurring", headers=auth_headers)
    data = response.json()
    assert len(data["expenses"]) == 1
    assert data["expenses"][0]["title"] == "Netflix"

def test_add_and_get_installment_expense(client, test_user, auth_headers):
    payload = {
        "title": "Laptop",
        "amount": 1000.0,
        "type": "tech",
        "is_recurring": "no",
        "is_installment": "yes",
        "num_installments": 5,
        "notes": "Work laptop",
        "labels": [{"name": "Gear", "color": "gray"}],
        "user_id": test_user.id,
        "date": datetime.utcnow().date().isoformat()
    }
    response = client.post("/api/expenses/add", json=payload, headers=auth_headers)
    assert response.status_code == 200

    response = client.get("/api/expenses/?expense_type=installment", headers=auth_headers)
    data = response.json()
    assert len(data["expenses"]) == 1
    assert data["expenses"][0]["title"] == "Laptop"

def test_delete_expenses(client, test_user, auth_headers, db_session):
    now = datetime.utcnow()
    # Create single expense
    single = Expense(
        title="Test Expense",
        amount=10.0,
        type="test",
        is_recurring=False,
        is_installment=False,
        user_id=test_user.id,
        date=now
    )
    db_session.add(single)

    # Create recurring
    recurring = RecurringExpense(
        title="Test Sub",
        amount=15.0,
        user_id=test_user.id,
        is_active=True,
        created_at=now
    )
    db_session.add(recurring)

    # Create installment
    begin_date = now.date()
    end_date = begin_date + timedelta(days=180)
    installment = InstallmentExpense(
        title="Car Payment",
        amount=300.0,
        user_id=test_user.id,
        is_active=True,
        is_installment=True,
        num_installments=6,
        begin_date=begin_date,
        end_date=end_date
    )
    db_session.add(installment)
    db_session.commit()

    recurring_id = recurring.id
    installment_id = installment.id
    single_id = single.id

    # Expire instances so we don’t try to access attributes later
    db_session.expunge_all()

    # Delete all
    res1 = client.delete(f"/api/expenses/delete/single/{single_id}", headers=auth_headers)
    res2 = client.delete(f"/api/expenses/delete/recurring/{recurring_id}", headers=auth_headers)
    res3 = client.delete(f"/api/expenses/delete/installment/{installment_id}", headers=auth_headers)

    assert res1.status_code == 200
    assert res2.status_code == 200
    assert res3.status_code == 200
    assert res1.json()["message"] == "Expense deleted successfully"
    assert res2.json()["message"] == "Expense deleted successfully"
    assert res3.json()["message"] == "Expense deleted successfully"
