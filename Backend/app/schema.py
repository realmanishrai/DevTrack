from pydantic import BaseModel
from typing import Optional

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
    