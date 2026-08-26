from pydantic import BaseModel
from uuid import UUID


class Checklists(BaseModel):
    id: UUID
    title: str


class Checklist_Create(BaseModel):
    title: str


class Checklist_Update(BaseModel):
    title: str | None = None
