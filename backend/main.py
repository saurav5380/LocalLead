from fastapi import FastAPI
import os
from dotenv import load_dotenv
# from pydantic_settings import BaseSettings
from sqlalchemy import create_engine, text


load_dotenv()

app = FastAPI()
db_url = os.getenv("DATABASE_URL")
db = create_engine(db_url)

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
    

    