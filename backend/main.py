from fastapi import FastAPI
import os
from dotenv import load_dotenv
# from pydantic_settings import BaseSettings
from sqlalchemy import create_engine, text
from fastapi.middleware.cors import CORSMiddleware

from api.routes.signup import router as signup_router
from api.routes.login import router as login_router
from api.routes.existing_leads import router as existing_leads_router
from api.routes.new_lead import router as new_lead_router
from api.routes.delete_lead import router as delete_lead_router
from api.routes.patch_lead import router as patch_lead_router
from api.routes.current_user import router as current_user_router
from api.routes.lead_by_id import router as lead_by_id_router

load_dotenv()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]


app = FastAPI()
db_url = os.getenv("DATABASE_URL")
db = create_engine(db_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(signup_router)
app.include_router(login_router)
app.include_router(existing_leads_router)
app.include_router(new_lead_router)
app.include_router(delete_lead_router)
app.include_router(patch_lead_router)
app.include_router(current_user_router)
app.include_router(lead_by_id_router)


@app.get("/",)
def home():
    return ("Home Page of Locallead")


@app.get("/db")
def dbcheck():
    try:
        with db.connect() as connection:
            response = connection.execute(text("SELECT 1"))
            row = response.fetchone()
            if row:
                return {'status': "DB is connected"}
    except Exception as e:
        return {'error': f"Could not connect DB due to error: {e}"}

