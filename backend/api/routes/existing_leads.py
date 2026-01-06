from fastapi import FastAPI, APIRouter, Depends, status, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from services.get_current_user import get_current_user
from backend.db import get_db


router = APIRouter()

@router.get("/getleads", status_code=status.HTTP_200_OK)
async def current_leads(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user["user_id"] is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail={"message": f"User id is missing. Invalid Request"}) 
    try:
        current_userid = current_user["user_id"]
        query = text("SELECT * FROM leads WHERE user_id=:user_id", {"user_id": current_userid})
        result = db.execute(query).fetchall()
        if result:
            return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail={"message": f"Current Leads could not be fetched: {str(e)}"})
    
    