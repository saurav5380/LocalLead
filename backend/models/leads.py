from db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (String,DateTime, Integer, Enum, func, ForeignKey)
from models.users import User
import enum
from datetime import datetime

class StatusEnum(enum.Enum):
    new = "new"
    contacted = "contacted"
    qualified = "qualified"
    won = "won"
    lost = "lost"



class Leads(Base):
    __tablename__ = "leads"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    phone: Mapped[str] = mapped_column(String, nullable=True)
    company_name: Mapped[str] = mapped_column(String, nullable=True)
    status: Mapped[StatusEnum] = mapped_column(Enum(StatusEnum), nullable=False, server_default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    user: Mapped[User] = relationship(back_populates="leads")

