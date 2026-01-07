from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from services.get_current_user import get_current_user
from backend.db import get_db


router = APIRouter()

@router.delete("deletelead/{id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(id:int, db:Session = Depends(get_db), current_user = Depends(get_current_user)):
    
