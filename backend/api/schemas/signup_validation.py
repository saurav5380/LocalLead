from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator, StringConstraints
from typing import Annotated

class SignupRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    email: Annotated[EmailStr, StringConstraints(to_lower=True)] 
    username: str = Field(..., min_length=4)
    password_hash: str = Field(..., min_length=6, max_length=128)
    fullname: str = Field(..., min_length=2, max_length=50)

    @field_validator("password")
    @classmethod
    def password_validator(cls, v:str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain one uppercase letter")
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must contain a digit")
        return v
    
    


