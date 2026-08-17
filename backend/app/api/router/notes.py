from fastapi import APIRouter, status

from ..deps import noteServiceDep
from ..schemas.note import Note_Create, Note_Read, Note_Update

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/", response_model=list[Note_Read])
async def get_notes(service: noteServiceDep):
    """get only the notes"""

    note = await service.get_notes()
    return note


@router.get("/{id}", response_model=Note_Read)
async def get_one_note(id: int, service: noteServiceDep):

    note = await service.get_one_note(id)
    return note


@router.post("/create/", response_model=Note_Read, status_code=status.HTTP_201_CREATED)
async def create_note(note: Note_Create, service: noteServiceDep):
    """create a new note"""
    new_note = await service.create_note(note)
    return new_note


@router.patch("/{id}", response_model=Note_Read)
async def update_note(id: int, note: Note_Update, service: noteServiceDep):
    """update a note"""
    data = note.model_dump(exclude_unset=True)
    updated_note = await service.update_note(id, data)
    return updated_note


@router.delete("/{id}", response_model=Note_Read)
async def delete_note(id: int, service: noteServiceDep):
    """delete a note"""
    return await service.delete_note(id)
