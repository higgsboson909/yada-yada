from collections.abc import Generator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, SQLModel, create_engine

from app.config import settings

from ..models.checklist_items import Checklist_Items
from ..models.checklists import Checklists
from ..models.notes import Notes

database_url = settings.postgres_url

engine = create_async_engine(url=database_url, echo=True)


async def init_db():
    async with engine.begin() as connection:
        await connection.run_sync(SQLModel.metadata.create_all)


async def get_session():
    async_session = sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session


# engine = create_engine(database_url, echo=True)


# def init_db():
#     SQLModel.metadata.create_all(engine)


# def get_session() -> Generator[Session]:
#     with Session(engine) as session:
#         yield session
