from fastapi import FastAPI, APIRouter, status, Depends, HTTPException
from passlib.context import CryptContext
from db import get_db
from ..schemas.userlogin_validation import UserLogin
from sqlalchemy import text
from services.generate_token import create_access_token
from sqlalchemy.orm import Session
from datetime import timedelta


app = FastAPI()
router = APIRouter()

@router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(current_user:UserLogin, db: Session = Depends(get_db)):
    try:
    # check if user is present
        user_exists = db.execute(text("SELECT username FROM USERS WHERE username=:username"),{"username": current_user.username}).fetchone()
        if (user_exists):
            result = db.execute(text("SELECT password_hash FROM USERS WHERE username=:username"),{"username": current_user.username})
            user_data = result.fetchone()
            if user_data is None:
                raise HTTPException(status_code=401, detail="Invalid Credential")
            stored_pwd_hash = user_data[0]
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            #verify password
            pwd_is_valid = pwd_context.verify(current_user.password, stored_pwd_hash)
            if not pwd_is_valid: 
                raise HTTPException(status_code=401, detail="Invalid username or password")
            if (pwd_is_valid): 
                user_data = {
                    "username": current_user.username
                }
                token = create_access_token(user_data, expires_delta=timedelta(minutes=30))
                return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        return {"message": f"Login failed due to error: {str(e)}"}
    
