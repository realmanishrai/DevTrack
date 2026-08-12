from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.room import router as room_router
from app.routers.dashboard import router as dashboard_router
from app import models
from app.database import engine
from app.routers.login import router as login_router
from app.routers.room_join import router as joinroom_router

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(room_router, tags=["Room"])


app.include_router(dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"])


app.include_router(
    login_router,
    tags=["Login"]
)

app.include_router(
    joinroom_router,
    tags=["Join Room"]
)