from pydantic import BaseModel
from uuid import UUID


class ChecklistItem_Create(BaseModel):
    title: str
    is_done: bool = False


class ChecklistItem_Read(BaseModel):
    id: UUID
    title: str
    is_done: bool = False
    checklist_id: UUID


class ChecklistItem_Update(BaseModel):
    title: str | None = None
    is_done: bool | None = None
