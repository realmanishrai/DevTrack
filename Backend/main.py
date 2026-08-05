from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ex(BaseModel):
  id: int
  name: str
  passw: str

@app.post("/")
def login(cred: ex):
  return "done"