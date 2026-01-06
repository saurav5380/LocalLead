from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Literal

class NewLead(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str = Field(min_length=10)
    email: EmailStr | None = None
    phone: str | None = None
    company_name: str | None  = None
    status: Literal["new", "contacted","qualified", "won", "lost"] = "new"
    