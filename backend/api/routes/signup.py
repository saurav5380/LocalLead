from fastapi import APIRouter,status, Depends, HTTPException    
from sqlalchemy.orm import Session 
from sqlalchemy import text
from api.schemas.signup_validation import SignupRequest
from db import get_db
from passlib.context import CryptContext

# password hash
ctx = CryptContext(schemes=["bcrypt"])

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def user_signup(new_user:SignupRequest,db:Session = Depends(get_db)):
    try:
        duplicate_email_query = text("SELECT email FROM public.users WHERE email = :email")
        user_exists = db.execute(duplicate_email_query,{"email":new_user.email}).fetchone()
        if (user_exists):
            raise HTTPException(status_code=409, detail="User already exists. Please log in with your userid and password.")
        duplicate_username_query = text("SELECT username FROM public.users WHERE username = :username")
        username_exists = db.execute(duplicate_username_query, {"username": new_user.username}).fetchone()
        if (username_exists):
            raise HTTPException(status_code=409, detail="Username already taken. Please choose another.")
        pwd_hash = ctx.hash(new_user.password)
        query = text("INSERT INTO public.users (email, username, password_hash, full_name) VALUES (:email, :username, :pwd_hash, :full_name)")
        user_data = {
            "email": new_user.email,
            "username": new_user.username,
            "pwd_hash": pwd_hash,
            "full_name": new_user.fullname 
        }
        result = db.execute(query,user_data)
        if (result):
            db.commit()
            return {"message": "User successfully created"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"User creation failed: {str(e)}")
