from fastapi import FastAPI, APIRouter, status
from passlib.context import CryptContext
from db import get_db
from schemas.userlogin_validation import UserLogin
from sqlalchemy import text
from jose import jwt
from services.generate_token import create_access_token



app = FastAPI()
router = APIRouter()
db = get_db()

@router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(current_user:UserLogin):
    # check if user is present
    user_exists = db.execute(text("SELECT username FROM USERS WHERE username=:username"),{"username": current_user.username})
    if (user_exists):
        pwd_hash_from_db = db.execute(text("SELECT password_hash FROM USERS WHERE username=:username"),{"username": current_user.username})
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        #verify password
        pwd_is_valid = pwd_context.verify(current_user.password, pwd_hash_from_db)
        if (pwd_is_valid): 
            user_data = {
                "username": current_user.username
            }
            token = create_access_token(user_data, expires_delta=30)
    return {"access_token": token, "token_type": "bearer"}
