from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from .checklist_items import Checklist_Items

if TYPE_CHECKING:
    from .checklist_items import Checklist_Items

class Checklists(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    checklist_items: list["Checklist_Items"] = Relationship(back_populates="checklist")