from fastapi import FastAPI

from .router import checklists 
from .router import notes

app = FastAPI()
app.include_router(checklists.router)
app.include_router(notes.router)

@app.get("/")
def get_yadas():
    """get everything"""
    pass

def main():
    print("Hello from backend!")

if __name__ == "__main__":
    main()
