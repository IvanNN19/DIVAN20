from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field

class ImportantItemBase(BaseModel):
    content: str = Field(..., max_length=500)

class ImportantItemCreate(ImportantItemBase):
    pass

class ImportantItemOut(ImportantItemBase):
    id: int

    class Config:
        orm_mode = True

class TripBase(BaseModel):
    tripName: str
    destination: str
    tripType: Optional[str] = None
    startDate: date
    duration: int
    totalBudget: float
    currency: Optional[str] = None
    travelersCount: Optional[int] = None
    accommodationType: Optional[str] = None
    tripDescription: Optional[str] = None
    mustSee: Optional[str] = None
    additionalNotes: Optional[str] = None
    notes: Optional[str] = None

class TripCreate(TripBase):
    important: List[ImportantItemCreate] = []

class TripUpdate(BaseModel):
    notes: Optional[str] = None
    important: Optional[List[ImportantItemCreate]] = None

class TripOut(BaseModel):
    id: int
    tripName: str
    destination: str
    tripType: Optional[str] = None
    startDate: date
    duration: int
    totalBudget: float
    currency: Optional[str] = None
    travelersCount: Optional[int] = None
    accommodationType: Optional[str] = None
    tripDescription: Optional[str] = None
    mustSee: Optional[str] = None
    additionalNotes: Optional[str] = None
    notes: Optional[str] = None
    important: List[ImportantItemOut] = []

    class Config:
        orm_mode = True 