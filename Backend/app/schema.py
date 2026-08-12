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
    assignee_ids: list[int]= []

    model_config = {'from_attributes': True}

class CreateTask(BaseModel):
    title: str
    description:str
    status: str
    progress: int
    priority: str
    due_date: str
    assignee_ids: list[int] = []
    

class UpdateTask(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    completed_at: Optional[str] = None
    assignee_ids: Optional[list[int]] = None
