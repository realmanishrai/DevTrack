from pydantic import BaseModel
from typing import Optional

class CreateRoom(BaseModel):
    room_name: str
    description: str

class GetTasks(BaseModel):
    id: int
    title: str
    description: str
    status: str
    progress: int
    priority: str
    created_by: int
    due_date: str
    completed_at: str
    created_at: str
    updated_at: str

    model_config = {'from_attributes': True}

class CreateTask(BaseModel):
    title: str
    description:str
    status: str
    progress: int
    priority: str
    due_date: str
    

class UpdateTask(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    completed_at: Optional[str] = None

class CreateUser(BaseModel):
    firstname: str
    lasttname: str
    username: str
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str