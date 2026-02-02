from fastapi import FastAPI, APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from services.get_current_user import get_current_user
from db import get_db
from ..schemas.current_leads import CurrentLeads

router = APIRouter()

@router.get("/leadsbyid/{id}", status_code=status.HTTP_200_OK, response_model= CurrentLeads)
async def current_leads(id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        current_userid = current_user["user_id"]
        query = text("SELECT * FROM leads WHERE user_id=:user_id AND id=:lead_id")
        result = db.execute(query,{"user_id": current_userid, "lead_id": id}).fetchone()
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail= {"error": "Unable to fetch lead."})
        return dict(result._mapping)     
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=f"The lead could not be fetched: {str(e)}")
    
    