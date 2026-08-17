from pydantic import BaseModel


class ChecklistItem_Create(BaseModel):
    title: str
    is_done: bool = False


class ChecklistItem_Read(BaseModel):
    id: int
    title: str
    is_done: bool = False
    checklist_id: int


class ChecklistItem_Update(BaseModel):
    title: str | None = None
    is_done: bool | None = None
