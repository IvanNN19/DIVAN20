from sqlalchemy.orm import Session
from typing import List
from . import models, schemas


def create_trip(db: Session, trip: schemas.TripCreate) -> models.Trip:
    db_trip = models.Trip(
        trip_name=trip.tripName,
        destination=trip.destination,
        trip_type=trip.tripType,
        start_date=trip.startDate,
        duration=trip.duration,
        total_budget=trip.totalBudget,
        currency=trip.currency,
        travelers_count=trip.travelersCount,
        accommodation_type=trip.accommodationType,
        trip_description=trip.tripDescription,
        must_see=trip.mustSee,
        additional_notes=trip.additionalNotes,
        notes=trip.notes or "",
    )
    db.add(db_trip)
    db.flush()

    for item in trip.important:
        db_item = models.ImportantItem(trip_id=db_trip.id, content=item.content)
        db.add(db_item)

    db.commit()
    db.refresh(db_trip)
    return db_trip


def list_trips(db: Session) -> List[models.Trip]:
    return db.query(models.Trip).order_by(models.Trip.id.desc()).all()


def get_trip(db: Session, trip_id: int) -> models.Trip | None:
    return db.query(models.Trip).filter(models.Trip.id == trip_id).first()


def update_trip(db: Session, trip_id: int, patch: schemas.TripUpdate) -> models.Trip | None:
    db_trip = get_trip(db, trip_id)
    if not db_trip:
        return None

    if patch.notes is not None:
        db_trip.notes = patch.notes

    if patch.important is not None:
        # Replace important items
        db.query(models.ImportantItem).filter(models.ImportantItem.trip_id == trip_id).delete()
        for item in patch.important:
            db_item = models.ImportantItem(trip_id=trip_id, content=item.content)
            db.add(db_item)

    db.commit()
    db.refresh(db_trip)
    return db_trip 