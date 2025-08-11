from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    trip_name = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    trip_type = Column(String(50), nullable=True)
    start_date = Column(Date, nullable=False)
    duration = Column(Integer, nullable=False)
    total_budget = Column(Float, nullable=False)
    currency = Column(String(10), nullable=True)
    travelers_count = Column(Integer, nullable=True)
    accommodation_type = Column(String(50), nullable=True)
    trip_description = Column(Text, nullable=True)
    must_see = Column(Text, nullable=True)
    additional_notes = Column(Text, nullable=True)

    notes = Column(Text, nullable=True)

    important_items = relationship("ImportantItem", back_populates="trip", cascade="all, delete-orphan")

class ImportantItem(Base):
    __tablename__ = "important_items"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(String(500), nullable=False)

    trip = relationship("Trip", back_populates="important_items") 