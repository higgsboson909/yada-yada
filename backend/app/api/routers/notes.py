from fastapi import APIRouter, status
from uuid import UUID
from ..deps import userDep

from ..deps import noteServiceDep
from ..schemas.note import Note_Create, Note_Read, Note_Update

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/", response_model=list[Note_Read])
async def get_notes(service: noteServiceDep, user: userDep):
    """get only the notes"""

    notes = await service.get_notes(user.id)
    return notes


@router.get("/{id}", response_model=Note_Read)
async def get_one_note(id: UUID, service: noteServiceDep, user: userDep):

    note = await service.get_one_note(id, user.id)
    return note


@router.post(
    "/create/",
    response_model=Note_Read,
    status_code=status.HTTP_201_CREATED,
)
async def create_note(note: Note_Create, service: noteServiceDep, user: userDep):
    """create a new note"""
    new_note = await service.create_note(note, user.id)
    return new_note


@router.patch("/{id}", response_model=Note_Read)
async def update_note(
    id: UUID, note: Note_Update, service: noteServiceDep, user: userDep
):
    """update a note"""
    data = note.model_dump(exclude_unset=True)
    updated_note = await service.update_note(id, data, user.id)
    return updated_note


@router.delete("/{id}", response_model=Note_Read)
async def delete_note(id: UUID, service: noteServiceDep, user: userDep):
    """delete a note"""
    return await service.delete_note(id, user.id)
