from fastapi import  Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from typing import Optional
from jose import jwt, JWTError, ExpiredSignatureError
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class TokenPayload(BaseModel):
    sub: Optional[str] = None

async def get_current_user(token: str = Depends(oauth2_scheme),
                           db: Session = Depends(get_db)) -> dict:
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                                detail="Invalid token: missing user information")
        response = db.execute(text("SELECT id, username, email, full_name FROM users WHERE username = :username"), {"username": username })
        user = response.fetchone()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Invalid Username, account does not exist.")
        
    
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token has expired")

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorised access")
    
    return {
        "user_id": user[0],
        "username": user[1],
        "email": user[2],
        "full_name": user[3]
    }



