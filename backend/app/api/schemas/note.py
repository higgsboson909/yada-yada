from pydantic import UUID4, BaseModel


class Note_Read(BaseModel):
    id: UUID4
    title: str
    content: str


class Note_Create(BaseModel):
    title: str
    content: str


class Note_Update(BaseModel):
    title: str | None = None
    content: str | None = None
