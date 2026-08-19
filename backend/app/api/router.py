from fastapi import APIRouter

from .routers import checklists
from .routers import checklist_items, notes

from .routers import users

master_router = APIRouter()

master_router.include_router(checklists.router)
master_router.include_router(notes.router)
master_router.include_router(checklist_items.router)
master_router.include_router(users.router)
