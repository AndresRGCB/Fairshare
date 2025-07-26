# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.exc import ProgrammingError
from app.main import app
from app.database import SessionLocal, Base, engine, get_db
from app.models import User, Expense, RecurringExpense, InstallmentExpense

# Create tables once for the whole test session
@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# Provide a new session per test
@pytest.fixture()
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.rollback()
        db.close()

# Override FastAPI's DB dependency with test DB session
@pytest.fixture()
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

# Clear all related tables before each test
@pytest.fixture(autouse=True)
def clear_test_data(db_session):
    try:
        db_session.query(Expense).delete()
        db_session.query(RecurringExpense).delete()
        db_session.query(InstallmentExpense).delete()
        db_session.query(User).delete()
        db_session.commit()
    except ProgrammingError:
        pass  # In case table doesn't exist yet
