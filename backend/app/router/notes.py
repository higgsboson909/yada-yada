from fastapi import APIRouter

router = APIRouter()

@router.get("/notes")
def get_notes():
    """get only the notes"""
    pass

@router.post("/notes/create")
def create_note():
    """create a new note"""
    pass

@router.patch("/notes/{id}")
def update_note(id: int):
    """update a note"""
    pass

@router.delete("/notes/{id}")
def delete_note(id: int):
    """delete a note"""
    pass

