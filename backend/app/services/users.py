from fastapi import status
from fastapi.exceptions import HTTPException
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..utils import generate_access_token
from ..api.schemas.user import UserCreate
from ..models.users import User

password_hash = PasswordHash.recommended()


class UserService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def add(self, credentials: UserCreate) -> User:

        result = await self.session.execute(select(User).where(User.email == credentials.email))
        if result.scalar_one_or_none() is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

        user = User(
            **credentials.model_dump(exclude={"password"}),
            password_hash=password_hash.hash(credentials.password),
        )

        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def token(self, email, password) -> str:
        result = await self.session.execute(select(User).where(User.email == email))
        user = result.scalar()
        if user is None or not password_hash.verify(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Incorrect email or password",
            )

        token = generate_access_token(
            data={"user": {"email": user.email, "id": str(user.id)}}
        )
        return token
