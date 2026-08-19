from fastapi import APIRouter

from ..deps import checklistItemServiceDep
from ..schemas.checklist_item import (
    ChecklistItem_Create,
    ChecklistItem_Read,
    ChecklistItem_Update,
)

router = APIRouter(prefix="/checklist_items", tags=["Checklist Items"])


@router.get("/{checklist_id}", response_model=list[ChecklistItem_Read])
async def get_checklist_item(checklist_id: int, service: checklistItemServiceDep):
    """get checklist items by checklist id"""
    return await service.get_checklist_items(checklist_id)


@router.post(
    "/{checklist_id}/create", response_model=ChecklistItem_Read, status_code=201
)
async def create_checklist_item(
    checklist_id: int,
    checklist_item: ChecklistItem_Create,
    service: checklistItemServiceDep,
):
    """create a new checklist item"""
    created_checklist_item = await service.create_checklist_item(checklist_id, checklist_item)
    
    print("hi")
    print(created_checklist_item)
    if created_checklist_item:
        return ChecklistItem_Read(**created_checklist_item.model_dump())


@router.patch("/{checklist_item_id}", response_model=ChecklistItem_Read)
async def update_checklist_item(
    checklist_item_id: int,
    checklist_item: ChecklistItem_Update,
    service: checklistItemServiceDep,
):
    """update a checklist item"""
    return await service.update_checklist_item(
        checklist_item_id, checklist_item.model_dump(exclude_unset=True)
    )


@router.delete("/{checklist_item_id}", response_model=ChecklistItem_Read)
async def delete_checklist_item(
    checklist_item_id: int, service: checklistItemServiceDep
):
    """delete a checklist item"""
    return await service.delete_checklist_item(checklist_item_id)
