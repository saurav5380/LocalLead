from db import Base
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import (String, DateTime, Integer, Index) 
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[String] = mapped_column(String, unique=True, nullable=False)
    username: Mapped[String] = mapped_column(String, nullable=False)
    password_hash: Mapped[String] = mapped_column(String, nullable=False)
    full_name: Mapped[String] = mapped_column(String, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    



