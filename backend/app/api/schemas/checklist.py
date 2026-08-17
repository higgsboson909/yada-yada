from pydantic import BaseModel

class Checklists(BaseModel):
    id: int
    title: str

class Checklist_Create(BaseModel):
    title: str

class Checklist_Update(BaseModel):
    title: str | None = None
