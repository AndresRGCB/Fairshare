# init_db.py
from models import Base, User, Label, Expense, RecurringExpense, InstallmentExpense
from database import engine

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created!")
