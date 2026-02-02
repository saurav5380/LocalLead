import sys
import os
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from db import SessionLocal, engine
from models.users import User
from passlib.context import CryptContext
from sqlalchemy import text

def create_test_user():
    """
    Creates a test user for UAT (User Acceptance Testing)

    Test Credentials:
    Username: testuser
    Password: Test@123
    Email: testuser@locallead.com
    Full Name: Test User
    """

    db = SessionLocal()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    try:
        # Check if test user already exists
        existing_user = db.execute(
            text("SELECT username FROM users WHERE username = :username"),
            {"username": "testuser"}
        ).fetchone()

        if existing_user:
            print("❌ Test user already exists!")
            print("\nTest Credentials:")
            print("Username: testuser")
            print("Password: Test@123")
            return

        # Hash the password
        hashed_password = pwd_context.hash("Test@123")

        # Create test user
        test_user = User(
            username="testuser",
            email="testuser@locallead.com",
            password_hash=hashed_password,
            full_name="Test User"
        )

        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        print("✅ Test user created successfully!")
        print("\n" + "="*50)
        print("TEST CREDENTIALS FOR UAT")
        print("="*50)
        print(f"Username: testuser")
        print(f"Password: Test@123")
        print(f"Email: testuser@locallead.com")
        print(f"Full Name: Test User")
        print(f"User ID: {test_user.id}")
        print("="*50)
        print("\n📝 Note: Use these credentials to test all API endpoints")

    except Exception as e:
        db.rollback()
        print(f"❌ Error creating test user: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
