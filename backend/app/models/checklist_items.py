from typing import TYPE_CHECKING
from uuid import UUID, uuid4


from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .checklists import Checklists


class Checklist_Items(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str
    is_done: bool = Field(default=False)
    checklist_id: UUID = Field(foreign_key="checklists.id")
    checklist: Checklists = Relationship(back_populates="checklist_items")
