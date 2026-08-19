from pydantic import BaseModel


class Note_Read(BaseModel):
    id: int
    title: str
    content: str


class Note_Create(BaseModel):
    title: str
    content: str


class Note_Update(BaseModel):
    title: str | None = None
    content: str | None = None
