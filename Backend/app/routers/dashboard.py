from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schema

router = APIRouter()


@router.post("/{room_code}/tasks")
def create_task(room_code: str, task: schema.CreateTask, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.room_code == room_code).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    new_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status,
        progress=task.progress,
        priority=task.priority,
        due_date=task.due_date
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@router.put("/{room_code}/tasks/{task_id}")
def update_task(room_code: str, task_id: int, task: schema.UpdateTask, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.room_code == room_code).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    existing_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if existing_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.status = task.status
    existing_task.progress = task.progress
    existing_task.priority = task.priority
    existing_task.due_date = task.due_date
    existing_task.completed_at = task.completed_at

    db.commit()
    db.refresh(existing_task)
    return existing_task
