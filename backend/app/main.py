from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import trips

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TravelPlanner API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trips.router, prefix="/trips", tags=["trips"]) 