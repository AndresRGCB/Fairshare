import aiosmtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()


SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
BASE_URL = os.getenv("BASE_URL")

async def send_verification_email(to_email: str, token: str):
    message = EmailMessage()
    message["From"] = SMTP_USER
    message["To"] = to_email
    message["Subject"] = "Welcome! Please Verify Your Email"

    verification_url = f"{BASE_URL}/verify-email?token={token}"  # 👈 Use your new route

    message.set_content(
        f"""Hello 👋,

Thank you for signing up to FairShare! 🎉

Please verify your email address by clicking the link below:

👉 {verification_url}

This helps us make sure it's really you.

If you didn't sign up, feel free to ignore this email.

Best,
The FairShare Team
"""
    )

    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASS
    )

