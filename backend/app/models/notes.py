from uuid import UUID, uuid4
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .users import User


class Notes(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str
    content: str
    user_id: UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="notes")
