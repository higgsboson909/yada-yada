from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from app.services.checklists import ChecklistService
from app.services.checklists_items import ChecklistItemService
from app.services.notes import NoteService

from ..data.session import get_session

sessionDep = Annotated[Session, Depends(get_session)]


def get_note_service(session: sessionDep):
    return NoteService(session)


noteServiceDep = Annotated[NoteService, Depends(get_note_service)]


def get_checklist_service(session: sessionDep):
    return ChecklistService(session)


checklistServiceDep = Annotated[ChecklistService, Depends(get_checklist_service)]


def get_checklist_item_service(session: sessionDep):
    return ChecklistItemService(session)


checklistItemServiceDep = Annotated[
    ChecklistItemService, Depends(get_checklist_item_service)
]
