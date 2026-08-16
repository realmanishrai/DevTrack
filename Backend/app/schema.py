from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

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
    due_date: date
    created_at: datetime
    updated_at: datetime
    assignee_ids: list[int]= []

    model_config = {'from_attributes': True}

class CreateTask(BaseModel):
    title: str
    description:str
    status: str
    progress: int
    priority: str
    due_date: date
    assignee_ids: list[int] = []

    model_config = {'from_attributes': True}
    

class UpdateTask(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None
    assignee_ids: Optional[list[int]] = None

    model_config = {'from_attributes': True}

class CreateUser(BaseModel):
    firstname: str
    lastname: str
    username: str
    email: str
    password: str

class ActivityLogResponse(BaseModel):
    id:int
    room_id: int
    user_id: int
    task_id: Optional[int]= None
    action_type: str
    description: str
    created_at: datetime

    model_config= {"from_attributes":True}

class ReturnUser(BaseModel):
    id: int
    firstname: str
    lastname: str
    username: str
    email: str

    model_config = {"from_attributes": True}

class UpdateUser(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    username: Optional[str] = None

    model_config = {"from_attributes": True}
