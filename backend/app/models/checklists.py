from sqlmodel import Field, SQLModel

class Checklist(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str

