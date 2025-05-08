from fastapi import FastAPI
from app.controllers import logs

app = FastAPI()

app.include_router(logs.router)
