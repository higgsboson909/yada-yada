from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.checklist_items import Checklist_Items

from ..api.schemas.checklist_item import ChecklistItem_Create
from ..exceptions import NotFoundException
from ..models.checklists import Checklists


class ChecklistItemService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_checklist_items(
        self, checklist_id: UUID, user_id: UUID
    ) -> list[Checklist_Items] | None:

        checklist = await self.session.get(Checklists, checklist_id)
        if checklist is None or checklist.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Checklist Not found"
            )
        checklist_items = await self.session.execute(
            select(Checklist_Items).where(Checklist_Items.checklist_id == checklist_id)
        )

        return list(checklist_items.scalars().all())

    async def get_one_checklist_item(
        self, checklist_item_id: UUID, user_id: UUID
    ) -> Checklist_Items:
        checklist_item = await self.session.get(Checklist_Items, checklist_item_id)
        if not checklist_item:
            raise NotFoundException()
        checklist = await self.session.get(Checklists, checklist_item.checklist_id)
        if checklist is None or checklist.user_id != user_id:
            raise NotFoundException()
        return checklist_item

    async def create_checklist_item(
        self, checklist_id: UUID, checklist_item: ChecklistItem_Create, user_id: UUID
    ) -> Checklist_Items:

        checklist = await self.session.get(Checklists, checklist_id)
        if checklist is None or checklist.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Checklist Not found"
            )

        new_checklist_item = Checklist_Items(
            checklist_id=checklist_id, **checklist_item.model_dump()
        )
        self.session.add(new_checklist_item)
        await self.session.commit()
        await self.session.refresh(new_checklist_item)
        return new_checklist_item

    async def update_checklist_item(
        self, checklist_item_id: UUID, checklist_item: dict, user_id: UUID
    ) -> Checklist_Items | None:
        existing_checklist_item = await self.get_one_checklist_item(
            checklist_item_id, user_id
        )

        updated_checklist_item = existing_checklist_item.sqlmodel_update(checklist_item)
        self.session.add(updated_checklist_item)
        await self.session.commit()
        await self.session.refresh(updated_checklist_item)
        return updated_checklist_item

    async def delete_checklist_item(
        self, checklist_item_id: UUID, user_id: UUID
    ) -> Checklist_Items:
        checklist_item = await self.get_one_checklist_item(checklist_item_id, user_id)

        await self.session.delete(checklist_item)
        await self.session.commit()
        return checklist_item
