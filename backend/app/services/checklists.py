from sqlmodel import Session, select

from ..api.schemas.checklist import Checklist_Create
from ..exceptions import NotFoundException
from ..models.checklists import Checklists


class ChecklistService:
    def __init__(self, session: Session):
        self.session = session

    async def get_checklists(self) -> list[Checklists]:
        result =await self.session.execute(select(Checklists))
        data = result.scalars()
        return data.all()

    async def get_one_checklist(self, checklist_id: int) -> Checklists:
        checklist = await self.session.get(Checklists, checklist_id)
        if not checklist:
            raise NotFoundException(checklist_id)
        return checklist

    async def create_checklist(self, checklist: Checklist_Create) -> Checklists:
        new_checklist = Checklists(**checklist.model_dump())
        self.session.add(new_checklist)
        await self.session.commit()
        await self.session.refresh(new_checklist)
        return new_checklist

    async def update_checklist(self, checklist_id: int, checklist: dict) -> Checklists:
        existing_checklist = await self.get_one_checklist(checklist_id)

        existing_checklist.sqlmodel_update(checklist)
        self.session.add(existing_checklist)
        await self.session.commit()
        await self.session.refresh(existing_checklist)
        return existing_checklist

    async def delete_checklist(self, checklist_id: int) -> Checklists:
        existing_checklist = await self.get_one_checklist(checklist_id)
        await self.session.delete(existing_checklist)
        await self.session.commit()
        return existing_checklist
