from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import crud, schemas, models

router = APIRouter()

@router.post("/", response_model=schemas.TripOut)
def create_trip_endpoint(payload: schemas.TripCreate, db: Session = Depends(get_db)):
    created = crud.create_trip(db, payload)
    return _to_trip_out(created)

@router.get("/", response_model=List[schemas.TripOut])
def list_trips_endpoint(db: Session = Depends(get_db)):
    trips = crud.list_trips(db)
    return [_to_trip_out(t) for t in trips]

@router.get("/{trip_id}", response_model=schemas.TripOut)
def get_trip_endpoint(trip_id: int, db: Session = Depends(get_db)):
    trip = crud.get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return _to_trip_out(trip)

@router.patch("/{trip_id}", response_model=schemas.TripOut)
def update_trip_endpoint(trip_id: int, payload: schemas.TripUpdate, db: Session = Depends(get_db)):
    updated = crud.update_trip(db, trip_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Trip not found")
    return _to_trip_out(updated)


def _to_trip_out(m: models.Trip) -> schemas.TripOut:
    return schemas.TripOut(
        id=m.id,
        tripName=m.trip_name,
        destination=m.destination,
        tripType=m.trip_type,
        startDate=m.start_date,
        duration=m.duration,
        totalBudget=m.total_budget,
        currency=m.currency,
        travelersCount=m.travelers_count,
        accommodationType=m.accommodation_type,
        tripDescription=m.trip_description,
        mustSee=m.must_see,
        additionalNotes=m.additional_notes,
        notes=m.notes or "",
        important=[schemas.ImportantItemOut(id=i.id, content=i.content) for i in m.important_items],
    ) 