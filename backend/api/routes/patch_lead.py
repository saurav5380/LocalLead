from fastapi import FastAPI, APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from services.get_current_user import get_current_user
from db import get_db
from ..schemas.patch_existing_lead import PatchLead

router = APIRouter()

@router.patch("/patchlead/{id}", status_code=status.HTTP_200_OK)
async def patch_lead(id: int, lead_data: PatchLead, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        current_user_id = current_user["user_id"]
        check_query = text("SELECT * FROM leads WHERE id=:lead_id AND user_id=:userid")
        existing_lead = db.execute(check_query, {"lead_id": id, "userid": current_user_id}).fetchone()
        if not existing_lead:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                detail="Lead not found")
        update_fields = []
        update_values = {"lead_id": id, "user_id": current_user_id}
        
        if lead_data.name is not None:
            update_fields.append("name = :name")
            update_values["name"] = lead_data.name
        
        if lead_data.email is not None:
            update_fields.append("email = :email")
            update_values["email"] = lead_data.email
        
        if lead_data.phone is not None:
            update_fields.append("phone = :phone")
            update_values["phone"] = lead_data.phone
        
        if lead_data.company_name is not None:
            update_fields.append("company_name = :company_name")
            update_values["company_name"] = lead_data.company_name

        if lead_data.status is not None:
            update_fields.append("status = :status")
            update_values["status"] = lead_data.status
        
        update_fields.append("updated_at = NOW()")

        if update_fields:
            update_query = text(f"""
                                           UPDATE leads
                                           SET {','.join(update_fields)}
                                           WHERE id = :lead_id AND user_id = :user_id
                                           RETURNING * """)
            result = db.execute(update_query, update_values).fetchone()
            db.commit()
            return dict(result._mapping)
        return dict(existing_lead._mapping)
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=f"Lead could not be updated due to error: {str(e)}")
    
