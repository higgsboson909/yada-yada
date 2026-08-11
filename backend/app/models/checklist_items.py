from sqlmodel import Field, SQLModel


class Checklist(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    isDone: bool = Field(default=False)
    checklist_id: int = Field(foreign_key="checklists.id")
