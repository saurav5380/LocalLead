from pydantic import BaseModel, EmailStr
from typing import Literal
from datetime import datetime

class CurrentLeads(BaseModel):
    id: int
    name: str 
    email: EmailStr | None = None
    user_id: int
    phone: str | None = None
    company_name: str | None = None
    status: Literal["new", "contacted","qualified", "won", "lost"] 
    created_at: datetime
    updated_at: datetime

