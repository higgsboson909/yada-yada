from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm

from ..deps import userServiceDep

from fastapi import APIRouter, Depends
from ..schemas.user import UserCreate, UserRead

router = APIRouter(prefix="/user")


@router.post("/signup", response_model=UserRead)
async def create_user(
    user: UserCreate,
    service: userServiceDep,
):
    return await service.add(user)


@router.post("/token")
async def login_user(
    request_form: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: userServiceDep,
):
    token = await service.token(request_form.username, request_form.password)

    return {
        "access_token": token,
        "type": "jwt",
    }
