from fastapi import APIRouter

router = APIRouter()

@router.get("/checklists")
def get_checklists():
    """get only the checklists"""
    pass

@router.post("/checklists/create")
def create_checklists():
    """create a new checklist"""
    pass

@router.patch("/checklists/{id}")
def update_checklist(id: int):
    """update a checklist"""
    pass

@router.delete("/checklists/{id}")
def delete_checklist(id: int):
    """delete a checklist"""
    pass

