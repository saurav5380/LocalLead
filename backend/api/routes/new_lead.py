from fastapi import Router, Depends, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from backend.db import get_db
router = Router()

class NewLead:
    name: str
    email: str
    phone: str
    company_name: str
    status: str = "new"

@router.post("/newlead", status_code=status.HTTP_201_CREATED)
async def new_lead(lead, db: Session = Depends(get_db)) -> NewLead:
    

