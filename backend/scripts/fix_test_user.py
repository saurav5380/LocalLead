import sys
import os
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from db import SessionLocal
from passlib.context import CryptContext
from sqlalchemy import text

def fix_test_user():
    """
    Updates the test user with a proper bcrypt password hash

    Test Credentials:
    Username: testuser
    Password: Test@123
    """

    db = SessionLocal()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    try:
        # Check if test user exists
        existing_user = db.execute(
            text("SELECT id, username, password_hash FROM users WHERE username = :username"),
            {"username": "testuser"}
        ).fetchone()

        if not existing_user:
            print("❌ Test user does not exist! Run create_test_user.py first.")
            return

        print(f"Found test user (ID: {existing_user[0]})")
        print(f"Current hash length: {len(existing_user[2])}")

        # Hash the password with bcrypt
        hashed_password = pwd_context.hash("Test@123")
        print(f"New hash length: {len(hashed_password)}")
        print(f"New hash preview: {hashed_password[:29]}...")

        # Update the password hash
        db.execute(
            text("UPDATE users SET password_hash = :password_hash WHERE username = :username"),
            {"password_hash": hashed_password, "username": "testuser"}
        )
        db.commit()

        print("\n✅ Test user password updated successfully!")
        print("\n" + "="*50)
        print("TEST CREDENTIALS FOR UAT")
        print("="*50)
        print(f"Username: testuser")
        print(f"Password: Test@123")
        print(f"Email: testuser@gmail.com")
        print("="*50)

        # Verify the update
        updated_user = db.execute(
            text("SELECT password_hash FROM users WHERE username = :username"),
            {"username": "testuser"}
        ).fetchone()

        # Test the password verification
        if pwd_context.verify("Test@123", updated_user[0]):
            print("✅ Password verification successful!")
        else:
            print("❌ Password verification failed!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error updating test user: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_test_user()
