from uuid import UUID

from fastapi import APIRouter

from ..deps import checklistServiceDep, userDep
from ..schemas.checklist import Checklist_Create, Checklist_Update, Checklists

router = APIRouter(prefix="/checklists", tags=["checklists"])


@router.get("/", response_model=list[Checklists])
async def get_checklists(service: checklistServiceDep, user: userDep):
    """get only the checklists"""
    print("hdkfadfkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", user.id)
    checklists = await service.get_checklists(user_id=user.id)
    return checklists


@router.get("/{id}", response_model=Checklists)
async def get_one_checklist(id: UUID, service: checklistServiceDep, user: userDep):
    """get one checklist"""
    checklist = await service.get_one_checklist(id, user_id=user.id)
    return checklist


@router.post("/create", response_model=Checklists, status_code=201)
async def create_checklists(
    checklists: Checklist_Create, service: checklistServiceDep, user: userDep
):
    """create a new checklist"""
    return await service.create_checklist(checklists, user_id=user.id)


@router.patch("/{id}", response_model=Checklists)
async def update_checklist(
    id: UUID, checklist: Checklist_Update, service: checklistServiceDep, user: userDep
):
    """update a checklist"""
    return await service.update_checklist(
        id, checklist.model_dump(exclude_unset=True), user_id=user.id
    )


@router.delete("/{id}", response_model=Checklists)
async def delete_checklist(id: UUID, service: checklistServiceDep, user: userDep):
    """delete a checklist"""
    return await service.delete_checklist(id, user_id=user.id)
