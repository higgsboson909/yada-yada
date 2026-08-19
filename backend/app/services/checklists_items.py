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
        self, checklist_id: int
    ) -> list[Checklist_Items] | None:
        checklist_items = await self.session.execute(
            select(Checklist_Items).where(Checklist_Items.checklist_id == checklist_id)
        )

        return list(checklist_items.scalars().all())

    async def get_one_checklist_item(self, checklist_item_id: int) -> Checklist_Items:
        checklist_item = await self.session.get(Checklist_Items, checklist_item_id)
        if not checklist_item:
            raise NotFoundException(checklist_item_id)
        return checklist_item

    async def create_checklist_item(
        self, checklist_id: int, checklist_item: ChecklistItem_Create
    ) -> Checklist_Items:
        checklist = await self.session.get(Checklists, checklist_id)
        if not checklist:
            raise NotFoundException(checklist_id)
        new_checklist_item = Checklist_Items(
            checklist_id=checklist_id, **checklist_item.model_dump()
        )
        print("hi first")
        self.session.add(new_checklist_item)
        await self.session.commit()
        await self.session.refresh(new_checklist_item)
        return new_checklist_item

    async def update_checklist_item(
        self, checklist_item_id: int, checklist_item: dict
    ) -> Checklist_Items | None:
        print("dict")
        existing_checklist_item = await self.get_one_checklist_item(checklist_item_id)

        updated_checklist_item = existing_checklist_item.sqlmodel_update(checklist_item)
        print(updated_checklist_item)
        self.session.add(updated_checklist_item)
        await self.session.commit()
        await self.session.refresh(updated_checklist_item)
        return updated_checklist_item

    async def delete_checklist_item(self, checklist_item_id: int) -> Checklist_Items:
        checklist_item = await self.get_one_checklist_item(checklist_item_id)
        await self.session.delete(checklist_item)
        await self.session.commit()
        return checklist_item
