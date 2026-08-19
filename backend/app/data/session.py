from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlmodel import SQLModel

from ..config import db_settings

from ..models.checklist_items import Checklist_Items
from ..models.checklists import Checklists
from ..models.notes import Notes
from ..models.users import User

database_url = db_settings.postgres_url

engine = create_async_engine(url=database_url, echo=True)


async def init_db():
    async with engine.begin() as connection:
        await connection.run_sync(SQLModel.metadata.create_all)


async def get_session():
    async_session = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
