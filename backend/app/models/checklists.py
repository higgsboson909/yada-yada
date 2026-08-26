from typing import TYPE_CHECKING
from uuid import uuid4, UUID

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
    from .checklist_items import Checklist_Items
    from .users import User


class Checklists(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str
    checklist_items: list["Checklist_Items"] = Relationship(back_populates="checklist")
    user_id: UUID = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="checklists")
