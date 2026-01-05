from pydantic import BaseModel, Field, EmailStr, ConfigDict
from pydantic_extra_types.phone_numbers import PhoneNumber
from typing import Literal


class NewLead(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str = Field(min_length=10)
    email: EmailStr | None = None
    phone: PhoneNumber | None = None
    company_name: str | None  = None
    status: Literal["new", "contacted","qualified", "won", "lost"] = "new"
    