from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models

from app.database import engine

from app.routers import dashboard as dashboard_router
from app.routers import login as login_router

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    dashboard_router.router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

app.include_router(
    login_router.router,
    prefix="/login",
    tags=["Login"]
)