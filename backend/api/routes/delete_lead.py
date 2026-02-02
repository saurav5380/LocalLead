from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from services.get_current_user import get_current_user
from db import get_db

router = APIRouter()

@router.delete("/deletelead/{lead_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(lead_id:int, db:Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        search_lead_query = text("SELECT * FROM leads WHERE id=:lead_id AND user_id=:userid")
        lead_found = db.execute(search_lead_query, {"lead_id" : lead_id, "userid": current_user["user_id"]}).fetchone()
        if lead_found:
            result = db.execute(text("DELETE FROM leads WHERE id=:lead_id AND user_id=:userid RETURNING *"), {"lead_id": lead_id, "userid": current_user["user_id"]}).fetchone()
            if result:
                db.commit()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Lead with {lead_id} not found. Error {str(e)}") 
       
