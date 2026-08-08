from pydantic import BaseModel

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