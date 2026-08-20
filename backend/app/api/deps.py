from typing import Annotated
from ..data.redis import is_blacklisted

from ..models.users import User
from ..utils import decode_access_token
from ..api.core.security import oauth2_scheme
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..services.users import UserService

from ..services.checklists import ChecklistService
from ..services.checklists_items import ChecklistItemService
from ..services.notes import NoteService

from ..data.session import get_session

sessionDep = Annotated[AsyncSession, Depends(get_session)]


def get_user_service(session: sessionDep):
    return UserService(session)


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


userServiceDep = Annotated[UserService, Depends(get_user_service)]


async def get_user_access_token_data(token: Annotated[str, Depends(oauth2_scheme)]):
    print(token)
    data = decode_access_token(token)
    if data is None or await is_blacklisted(data["jti"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )
    return data


async def get_current_user(
    token_data: Annotated[dict, Depends(get_user_access_token_data)],
    session: sessionDep,
) -> User | None:
    current_user = await session.get(User, token_data["user"]["id"])
    return current_user


userDep = Annotated[User, Depends(get_current_user)]
