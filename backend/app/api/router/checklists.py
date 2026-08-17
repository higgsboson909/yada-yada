from fastapi import APIRouter

from ..deps import checklistServiceDep
from ..schemas.checklist import Checklist_Create, Checklist_Update, Checklists

router = APIRouter(prefix="/checklists", tags=["checklists"])


@router.get("/", response_model=list[Checklists])
async def get_checklists(service: checklistServiceDep):
    """get only the checklists"""
    checklists = await service.get_checklists()
    return checklists


@router.get("/{id}", response_model=Checklists)
async def get_one_checklist(id: int, service: checklistServiceDep):
    """get one checklist"""
    checklist = await service.get_one_checklist(id)
    return checklist


@router.post("/create", response_model=Checklists, status_code=201)
async def create_checklists(checklists: Checklist_Create, service: checklistServiceDep):
    """create a new checklist"""
    return await service.create_checklist(checklists)


@router.patch("/{id}", response_model=Checklists)
async def update_checklist(id: int, checklist: Checklist_Update, service: checklistServiceDep):
    """update a checklist"""
    return await service.update_checklist(id, checklist.model_dump(exclude_unset=True))


@router.delete("/{id}", response_model=Checklists)
async def delete_checklist(id: int, service: checklistServiceDep):
    """delete a checklist"""
    return await service.delete_checklist(id)
