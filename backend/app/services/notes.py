from sqlmodel import select
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from ..api.schemas.note import Note_Create, Note_Read
from ..exceptions import NotFoundException
from ..models.notes import Notes


class NoteService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_one_note(self, note_id: UUID, user_id: UUID) -> Notes:
        print("yyum pumyum pumyum pumyum pumyum pumum pum")

        note = await self.session.execute(
            select(Notes).where(Notes.user_id == user_id, Notes.id == note_id)
        )
        result = note.scalars().one_or_none()
        if not result:
            raise NotFoundException()
        return result

    async def get_notes(self, user_id) -> list[Notes]:
        result = await self.session.execute(
            select(Notes).where(Notes.user_id == user_id)
        )
        data = result.scalars()
        return list(data.all())

    async def create_note(self, note: Note_Create, user_id: UUID) -> Notes:
        print(user_id)
        new_note = Notes(**note.model_dump(), user_id=user_id)
        self.session.add(
            new_note,
        )
        await self.session.commit()
        await self.session.refresh(new_note)
        return new_note

    async def update_note(self, note_id: UUID, note: dict, user_id: UUID) -> Notes:

        existing_note = await self.get_one_note(note_id, user_id=user_id)

        existing_note.sqlmodel_update(note)
        self.session.add(existing_note)
        await self.session.commit()
        await self.session.refresh(existing_note)
        return existing_note

    async def delete_note(self, note_id: UUID, user_id: UUID) -> Note_Read:
        existing_note = await self.get_one_note(note_id, user_id)

        await self.session.delete(existing_note)
        await self.session.commit()
        return Note_Read(**existing_note.model_dump())
