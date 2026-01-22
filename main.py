
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import enum

# Database Setup
DATABASE_URL = "sqlite:///./tasks.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class PriorityEnum(str, enum.Enum):
    URGENT = "Urgent"
    NON_URGENT = "Non-Urgent"

class StatusEnum(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"

# SQLAlchemy Model
class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    due_date = Column(String, nullable=True)
    priority = Column(SQLEnum(PriorityEnum), default=PriorityEnum.NON_URGENT)
    status = Column(SQLEnum(StatusEnum), default=StatusEnum.TODO)

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: PriorityEnum = PriorityEnum.NON_URGENT
    status: StatusEnum = StatusEnum.TODO

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None

class TaskResponse(TaskBase):
    id: int
    class Config:
        from_attributes = True

# FastAPI App
app = FastAPI(title="Zenith Task API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints
@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@app.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
