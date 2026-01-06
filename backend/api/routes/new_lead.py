from fastapi import APIRouter, Depends, status, HTTPException
from schemas.newlead_validation import NewLead
from services.get_current_user import get_current_user
from sqlalchemy import text
from sqlalchemy.orm import Session
from models.leads import Leads
from backend.db import get_db
router = APIRouter()

@router.post("/newlead", status_code=status.HTTP_201_CREATED)
async def new_lead(lead:NewLead, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)) -> NewLead:
    try:
        if 'name' not in lead.keys():
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, 
                            detail="Invalid Lead. Name is missing.")
        # query = text("INSERT INTO public.leads (name, email, user_id, phone, company_name, status) VALUES (:name, :email, :user_id, :phone, :company_name, :status)")
        lead_data = Leads(
            name=lead.name,
            email=lead.email,
            user_id=current_user.user_id,
            phone=lead.phone,
            company_name=lead.company_name,
            status=lead.status
            )
        db.add(lead_data)
        db.commit()
        db.refresh(lead_data)
        return {
            "message": "Lead Created Successfully",
            "lead": {
                "id": lead_data.id,
                "name": lead_data.name,
                "email": lead_data.email,
                "status": lead_data.status,
                "created_at": lead_data.created_at,
                "updated_at": lead_data.updated_at
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=f"Lead could not be created due to error: {str(e)}")


