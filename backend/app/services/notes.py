from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..api.schemas.note import Note_Create, Note_Read
from ..exceptions import NotFoundException
from ..models.notes import Notes


class NoteService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_one_note(self, note_id: int):

        note = await self.session.get(Notes, note_id)
        if not note:
            raise NotFoundException(note_id)
        return note

    async def get_notes(self) -> list[Notes]:
        result = await self.session.execute(select(Notes))
        data = result.scalars()
        return list(data.all())

    async def create_note(self, note: Note_Create) -> Notes:
        new_note = Notes(**note.model_dump())
        self.session.add(new_note)
        await self.session.commit()
        await self.session.refresh(new_note)
        return new_note

    async def update_note(self, note_id: int, note: dict) -> Notes:

        existing_note = await self.get_one_note(note_id)

        existing_note.sqlmodel_update(note)
        self.session.add(existing_note)
        await self.session.commit()
        await self.session.refresh(existing_note)
        return existing_note

    async def delete_note(self, note_id: int) -> Note_Read:
        existing_note = await self.get_one_note(note_id)

        await self.session.delete(existing_note)
        await self.session.commit()
        return Note_Read(**existing_note.model_dump())
