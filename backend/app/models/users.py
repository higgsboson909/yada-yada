from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .notes import Notes
    from .checklists import Checklists


class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str
    email: EmailStr = Field(index=True, unique=True)
    password_hash: str
    notes: list["Notes"] = Relationship(back_populates="user")
    checklists: list["Checklists"] = Relationship(back_populates="user")

