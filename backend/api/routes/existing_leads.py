from fastapi import FastAPI, APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from services.get_current_user import get_current_user
from backend.db import get_db
from typing import List
from schemas.current_leads import CurrentLeads

router = APIRouter()

@router.get("/getleads", status_code=status.HTTP_200_OK, response_model= List[CurrentLeads])
async def current_leads(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        current_userid = current_user["id"]
        query = text("SELECT * FROM leads WHERE user_id=:user_id")
        result = db.execute(query,{"user_id": current_userid}).fetchall()
        if not result:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                                detail= {"error": "Unable to fetch leads."})
        return [dict(row) for row in result]    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=f"Current Leads could not be fetched: {str(e)}")
    
    