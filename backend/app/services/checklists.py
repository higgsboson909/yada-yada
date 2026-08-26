from uuid import UUID

from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..api.schemas.checklist import Checklist_Create
from ..exceptions import NotFoundException
from ..models.checklists import Checklists


class ChecklistService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_checklists(self, user_id: UUID) -> list[Checklists]:
        result = await self.session.execute(
            select(Checklists).where(Checklists.user_id == user_id)
        )
        data = result.scalars()
        return list(data.all())

    async def get_one_checklist(self, checklist_id: UUID, user_id) -> Checklists:
        checklist = await self.session.execute(
            select(Checklists).where(
                Checklists.id == checklist_id, Checklists.user_id == user_id
            )
        )
        result = checklist.scalars().one_or_none()
        if not result:
            raise NotFoundException()
        return result

    async def create_checklist(
        self, checklist: Checklist_Create, user_id
    ) -> Checklists:
        new_checklist = Checklists(**checklist.model_dump(), user_id=user_id)
        self.session.add(new_checklist)
        await self.session.commit()
        await self.session.refresh(new_checklist)
        return new_checklist

    async def update_checklist(
        self, checklist_id: UUID, checklist: dict, user_id
    ) -> Checklists:
        existing_checklist = await self.get_one_checklist(checklist_id, user_id)

        existing_checklist.sqlmodel_update(checklist)
        self.session.add(existing_checklist)
        await self.session.commit()
        await self.session.refresh(existing_checklist)
        return existing_checklist

    async def delete_checklist(self, checklist_id: UUID, user_id) -> Checklists:
        existing_checklist = await self.get_one_checklist(checklist_id, user_id)
        await self.session.delete(existing_checklist)
        await self.session.commit()
        return existing_checklist
