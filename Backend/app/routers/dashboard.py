from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schema import GetTasks
from app.database import get_db
from app.models import Task, Room
from app import models, schema
from datetime import datetime
from app.auth import get_current_user, ensure_room_member

router = APIRouter()

@router.get("/{room_code}/tasks", response_model=list[GetTasks])
def get_tasks(room_code: str, db: Session = Depends(get_db), current_user= Depends(get_current_user)):
  room = db.query(Room).filter(Room.room_code == room_code).first()
  if room is None:
    raise HTTPException(status_code=404, detail="Room not found")
  ensure_room_member(room.id, db, current_user.id)
  tasks= db.query(Task).filter(Task.room_id == room.id).all()
  return[
     {
        "id": task.id,
        "title":task.title,
        "description": task.description,
        "status": task.status,
        "progress": task.progress,
        "priority": task.priority,
        "created_by": task.created_by,
        "due_date": task.due_date,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        "assignee_ids": [assignee.user_id for assignee in task.assignees]
     }
     for task in tasks
  ]



@router.delete("/{room_code}/tasks/{id}")
def delete_task(room_code: str, 
                id: int, 
                db: Session = Depends(get_db),
                current_user= Depends(get_current_user)
                ):
  room = db.query(Room).filter(Room.room_code == room_code).first()
  if room is None:
      raise HTTPException(status_code=404, detail="Room not found")
  ensure_room_member(room.id, db, current_user.id)
  task = db.query(Task).filter(Task.id == id).first()
  if task is None:
     raise HTTPException(
        status_code=404,
        detail= "Task not found",
     )
  task_title= task.title

  db.delete(task)
  db.commit()

  activity = models.ActivityLog(
     room_id= room.id,
     user_id=current_user.id,
     task_id= id,
     action_type= "Task Deleted",
     description=f"Task '{task_title}' was deleted"
  )

  db.add(activity)
  db.commit()
  return {"msg": "Task Deleted Successfully"}



@router.post("/{room_code}/tasks")
def create_task(room_code: str, 
                task: schema.CreateTask, 
                db: Session = Depends(get_db),
                current_user= Depends(get_current_user)
                ):
    room = db.query(models.Room).filter(models.Room.room_code == room_code).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    ensure_room_member(room.id, db, current_user.id)
    new_task = models.Task(
        room_id=room.id,
        title=task.title,
        description=task.description,
        status=task.status,
        progress=task.progress,
        priority=task.priority,
        created_by=current_user.id,
        due_date=task.due_date
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    activity= models.ActivityLog(
       room_id= room.id,
       user_id= current_user.id,
       task_id= new_task.id,
       action_type="Task Created",
       description=f"Task '{new_task.title}' was created"
    )
    db.add(activity)
    db.commit()

    for user_id in task.assignee_ids:
       member = db.query(models.RoomMember).filter(
          models.RoomMember.user_id== user_id,
          models.RoomMember.room_id== room.id
       ).first()
       if member is None:
          raise HTTPException(
             status_code=400,
             detail=f"User {user_id} is not a member of this room"
          )
       assignee= models.TaskAssignee(
          task_id= new_task.id,
          user_id= user_id,
          assigned_by= current_user.id
       )
       db.add(assignee)
       db.commit()
    return {"msg": "Task created successfully", "task_id": new_task.id}


@router.put("/{room_code}/tasks/{task_id}")
def update_task(room_code: str, 
                task_id: int, 
                task: schema.UpdateTask, 
                db: Session = Depends(get_db),
                current_user= Depends(get_current_user)
                ):
   room = db.query(models.Room).filter(models.Room.room_code == room_code).first()
   if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
   ensure_room_member(room.id, db, current_user.id)
   existing_task = db.query(models.Task).filter(models.Task.id == task_id).first()
   if existing_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

   # Only update fields that were provided
   if task.title is not None:
      existing_task.title = task.title
   if task.description is not None:
      existing_task.description = task.description
   if task.status is not None:
      existing_task.status = task.status
   if task.progress is not None:
      existing_task.progress = task.progress
   if task.priority is not None:
      existing_task.priority = task.priority
   if task.due_date is not None:
      existing_task.due_date = task.due_date

   activity = models.ActivityLog(
      room_id=room.id,
      user_id=current_user.id,
      task_id=existing_task.id,
      action_type="Task Updated",
      description=f"Task '{existing_task.title}' was updated"
   )
   db.add(activity)

   # Sync assignees if provided: delete removed, add new
   if task.assignee_ids is not None:
      existing_assignees = db.query(models.TaskAssignee).filter(
         models.TaskAssignee.task_id == existing_task.id
      ).all()

      old_assignee_ids = {assignee.user_id for assignee in existing_assignees}
      new_assignee_ids = set(task.assignee_ids)

      # delete removed assignees
      for assignee in existing_assignees:
         if assignee.user_id not in new_assignee_ids:
            db.delete(assignee)

      # add newly assigned users
      to_add = new_assignee_ids - old_assignee_ids
      for user_id in to_add:
         member = db.query(models.RoomMember).filter(
            models.RoomMember.room_id == room.id,
            models.RoomMember.user_id == user_id
         ).first()
         if member is None:
            raise HTTPException(
               status_code=400,
               detail=f"User {user_id} is not a member of this room"
            )
         assignee = models.TaskAssignee(
            task_id=existing_task.id,
            user_id=user_id,
            assigned_by=current_user.id
         )
         db.add(assignee)

   # Commit all changes once and refresh
   db.commit()
   db.refresh(existing_task)
   return {"msg": "Task updated successfully", "task_id": existing_task.id}
             