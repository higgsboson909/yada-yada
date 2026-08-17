from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from scalar_fastapi import get_scalar_api_reference
from sqlalchemy.exc import SQLAlchemyError

from app.api.router import checklists, notes, checklist_items

from .data.session import init_db
from .exceptions import NotFoundException


@asynccontextmanager
async def lifespan_handler(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan_handler, title="Yada Yada API", version="0.1.0")
app.include_router(checklists.router)
app.include_router(notes.router)
app.include_router(checklist_items.router)


@app.get("/")
def get_yadas():
    """get everything"""
    pass


@app.get("/scalar", include_in_schema=False)
def get_scalar():
    """get a scalar value"""
    return get_scalar_api_reference(
        openapi_url=app.openapi_url, title="Yada Yada API Reference"
    )


@app.exception_handler(NotFoundException)
def not_found_exception_handler(request: Request, exc: NotFoundException):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"message": exc.message},
    )


@app.exception_handler(SQLAlchemyError)
def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    print(f"Database error on {request.url.path}: {exc}")

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal Server Error: Database operation failed."},
    )


@app.exception_handler(Exception)
def general_exception_handler(request: Request, exc: Exception):
    print(f"Unexpected error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal Server Error: An unexpected error occurred."},
    )


def main():
    print("Hello from backend!")


if __name__ == "__main__":
    main()
