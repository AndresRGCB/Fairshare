from celery.schedules import crontab
from celery_config import celery

celery.conf.beat_schedule = {
    "run-monthly-expenses": {
        "task": "tasks.process_monthly_expenses",
        "schedule": crontab(day_of_month=1, hour=0, minute=0),  # Runs on the 1st at midnight UTC
    },
}
