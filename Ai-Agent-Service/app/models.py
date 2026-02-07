from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime


class GenerateRequest(BaseModel):
    user_id: str
    chat_id: str
    message: str


class GenerateResponse(BaseModel):
    message: str


class ChatMessage(BaseModel):
    message_id: str
    sender: Literal["human", "agent"]
    message: str
    index: int
    created_at: str


class Timeslot(BaseModel):
    date: str
    hour_start: str


class Booking(BaseModel):
    booking_id: str
    timeslot: Timeslot
    status: str


class ScheduleSlot(BaseModel):
    hour_start: str
    max_capacity: int
    booked_capacity: int
    late_capacity: int


class PortSchedule(BaseModel):
    date: str
    schedule: List[ScheduleSlot]


# Tool request/response models
class BookingStatusRequest(BaseModel):
    booking_id: str
    user_id: str


class UserBookingsRequest(BaseModel):
    user_id: str
    date: str
    hour: str


class PortScheduleRequest(BaseModel):
    terminal_id: str
    date: str
    user_id: str
    user_role: str
