from pydantic import BaseModel
from typing import Literal

class PatchLead(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    company_name: str | None = None
    status: Literal["new", "contacted","qualified", "won", "lost"]

