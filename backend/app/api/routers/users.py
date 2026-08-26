from typing import Annotated
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm


from ...data.redis import add_jti_to_blacklist


from ..deps import get_user_access_token_data, userServiceDep

from fastapi import APIRouter, Depends, status
from ..schemas.user import UserCreate, UserRead

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/signup", response_model=UserRead)
async def create_user(user: UserCreate, service: userServiceDep):
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


@router.post("/logout")
@router.get("/logout", include_in_schema=False)
async def logout_user(user_data: Annotated[dict, Depends(get_user_access_token_data)]):
    jti = user_data["jti"]
    await add_jti_to_blacklist(jti)
    return JSONResponse(
        status_code=status.HTTP_200_OK, content="Logged out Successfully!"
    )
