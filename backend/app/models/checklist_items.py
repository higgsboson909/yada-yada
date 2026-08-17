from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .checklists import Checklists


class Checklist_Items(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    is_done: bool = Field(default=False)
    checklist_id: int = Field(foreign_key="checklists.id")
    checklist: Checklists = Relationship(back_populates="checklist_items")
