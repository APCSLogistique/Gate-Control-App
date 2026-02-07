"""
Mock API Server

This server mimics the production API with static data for testing
the AI Agent Service without needing the actual backend.

Run with: python mock_api.py
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
import uvicorn

app = FastAPI(
    title="Mock API Server",
    description="Mock backend API for AI Agent testing",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# MODELS
# ============================================================================


class Timeslot(BaseModel):
    date: str
    hour_start: str


class Booking(BaseModel):
    booking_id: str
    timeslot: Timeslot
    status: str


class ChatMessage(BaseModel):
    message_id: str
    sender: str  # "human" or "agent"
    message: str
    index: int
    created_at: str


class Chat(BaseModel):
    chat_id: str
    user_id: str
    created_at: str


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


class ScheduleSlot(BaseModel):
    hour_start: str
    max_capacity: int
    booked_capacity: int
    late_capacity: int


class PortSchedule(BaseModel):
    date: str
    schedule: List[ScheduleSlot]


# ============================================================================
# STATIC DATA
# ============================================================================

# Mock bookings database
BOOKINGS_DB = {
    "BK123": {
        "booking_id": "BK123",
        "user_id": "U456",
        "timeslot": {"date": "2024-02-07", "hour_start": "14"},
        "status": "confirmed",
        "terminal_id": "T1",
    },
    "BK456": {
        "booking_id": "BK456",
        "user_id": "U456",
        "timeslot": {"date": "2024-02-07", "hour_start": "16"},
        "status": "confirmed",
        "terminal_id": "T1",
    },
    "BK789": {
        "booking_id": "BK789",
        "user_id": "U456",
        "timeslot": {"date": "2024-02-08", "hour_start": "10"},
        "status": "pending",
        "terminal_id": "T2",
    },
    "BK999": {
        "booking_id": "BK999",
        "user_id": "U789",
        "timeslot": {"date": "2024-02-07", "hour_start": "14"},
        "status": "cancelled",
        "terminal_id": "T1",
    },
}

# Mock chat messages
CHAT_MESSAGES_DB = {
    "chat_abc123": [
        {
            "message_id": "msg_001",
            "sender": "human",
            "message": "What are my bookings today?",
            "index": 0,
            "created_at": "2024-02-07T14:30:00Z",
        },
        {
            "message_id": "msg_002",
            "sender": "agent",
            "message": "You have 2 bookings today: BK123 at 14:00 and BK456 at 16:00.",
            "index": 1,
            "created_at": "2024-02-07T14:30:05Z",
        },
        {
            "message_id": "msg_003",
            "sender": "human",
            "message": "Can I reschedule BK123?",
            "index": 2,
            "created_at": "2024-02-07T14:31:00Z",
        },
    ]
}

# Mock terminal schedules
TERMINAL_SCHEDULES = {
    "T1": {
        "2024-02-07": [
            {
                "hour_start": "08",
                "max_capacity": 10,
                "booked_capacity": 7,
                "late_capacity": 0,
            },
            {
                "hour_start": "09",
                "max_capacity": 10,
                "booked_capacity": 5,
                "late_capacity": 1,
            },
            {
                "hour_start": "10",
                "max_capacity": 10,
                "booked_capacity": 2,
                "late_capacity": 0,
            },
            {
                "hour_start": "11",
                "max_capacity": 10,
                "booked_capacity": 8,
                "late_capacity": 0,
            },
            {
                "hour_start": "12",
                "max_capacity": 10,
                "booked_capacity": 6,
                "late_capacity": 1,
            },
            {
                "hour_start": "13",
                "max_capacity": 10,
                "booked_capacity": 4,
                "late_capacity": 0,
            },
            {
                "hour_start": "14",
                "max_capacity": 10,
                "booked_capacity": 9,
                "late_capacity": 0,
            },
            {
                "hour_start": "15",
                "max_capacity": 10,
                "booked_capacity": 3,
                "late_capacity": 0,
            },
            {
                "hour_start": "16",
                "max_capacity": 10,
                "booked_capacity": 7,
                "late_capacity": 1,
            },
            {
                "hour_start": "17",
                "max_capacity": 10,
                "booked_capacity": 5,
                "late_capacity": 0,
            },
        ],
        "2024-02-08": [
            {
                "hour_start": "08",
                "max_capacity": 10,
                "booked_capacity": 3,
                "late_capacity": 0,
            },
            {
                "hour_start": "09",
                "max_capacity": 10,
                "booked_capacity": 2,
                "late_capacity": 0,
            },
            {
                "hour_start": "10",
                "max_capacity": 10,
                "booked_capacity": 1,
                "late_capacity": 0,
            },
            {
                "hour_start": "11",
                "max_capacity": 10,
                "booked_capacity": 4,
                "late_capacity": 0,
            },
            {
                "hour_start": "12",
                "max_capacity": 10,
                "booked_capacity": 3,
                "late_capacity": 0,
            },
            {
                "hour_start": "13",
                "max_capacity": 10,
                "booked_capacity": 2,
                "late_capacity": 0,
            },
            {
                "hour_start": "14",
                "max_capacity": 10,
                "booked_capacity": 1,
                "late_capacity": 0,
            },
            {
                "hour_start": "15",
                "max_capacity": 10,
                "booked_capacity": 0,
                "late_capacity": 0,
            },
            {
                "hour_start": "16",
                "max_capacity": 10,
                "booked_capacity": 2,
                "late_capacity": 0,
            },
            {
                "hour_start": "17",
                "max_capacity": 10,
                "booked_capacity": 1,
                "late_capacity": 0,
            },
        ],
    },
    "T2": {
        "2024-02-07": [
            {
                "hour_start": "08",
                "max_capacity": 15,
                "booked_capacity": 10,
                "late_capacity": 1,
            },
            {
                "hour_start": "09",
                "max_capacity": 15,
                "booked_capacity": 8,
                "late_capacity": 0,
            },
            {
                "hour_start": "10",
                "max_capacity": 15,
                "booked_capacity": 5,
                "late_capacity": 0,
            },
            {
                "hour_start": "11",
                "max_capacity": 15,
                "booked_capacity": 12,
                "late_capacity": 1,
            },
            {
                "hour_start": "12",
                "max_capacity": 15,
                "booked_capacity": 9,
                "late_capacity": 0,
            },
            {
                "hour_start": "13",
                "max_capacity": 15,
                "booked_capacity": 6,
                "late_capacity": 0,
            },
            {
                "hour_start": "14",
                "max_capacity": 15,
                "booked_capacity": 11,
                "late_capacity": 2,
            },
            {
                "hour_start": "15",
                "max_capacity": 15,
                "booked_capacity": 7,
                "late_capacity": 0,
            },
            {
                "hour_start": "16",
                "max_capacity": 15,
                "booked_capacity": 10,
                "late_capacity": 1,
            },
            {
                "hour_start": "17",
                "max_capacity": 15,
                "booked_capacity": 8,
                "late_capacity": 0,
            },
        ],
        "2024-02-08": [
            {
                "hour_start": "08",
                "max_capacity": 15,
                "booked_capacity": 5,
                "late_capacity": 0,
            },
            {
                "hour_start": "09",
                "max_capacity": 15,
                "booked_capacity": 3,
                "late_capacity": 0,
            },
            {
                "hour_start": "10",
                "max_capacity": 15,
                "booked_capacity": 2,
                "late_capacity": 0,
            },
            {
                "hour_start": "11",
                "max_capacity": 15,
                "booked_capacity": 6,
                "late_capacity": 0,
            },
            {
                "hour_start": "12",
                "max_capacity": 15,
                "booked_capacity": 4,
                "late_capacity": 0,
            },
            {
                "hour_start": "13",
                "max_capacity": 15,
                "booked_capacity": 3,
                "late_capacity": 0,
            },
            {
                "hour_start": "14",
                "max_capacity": 15,
                "booked_capacity": 7,
                "late_capacity": 0,
            },
            {
                "hour_start": "15",
                "max_capacity": 15,
                "booked_capacity": 2,
                "late_capacity": 0,
            },
            {
                "hour_start": "16",
                "max_capacity": 15,
                "booked_capacity": 4,
                "late_capacity": 0,
            },
            {
                "hour_start": "17",
                "max_capacity": 15,
                "booked_capacity": 3,
                "late_capacity": 0,
            },
        ],
    },
}


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================


def verify_token(authorization: Optional[str] = Header(None)):
    pass


# ============================================================================
# ENDPOINTS
# ============================================================================


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "Mock API Server",
        "message": "This is a mock API for testing the AI Agent Service",
    }


@app.get("/api/chat/{chat_id}")
async def get_chat(chat_id: str, authorization: Optional[str] = Header(None)):
    """Get chat metadata"""
    verify_token(authorization)

    return {"chat_id": chat_id, "user_id": "U456", "created_at": "2024-02-07T10:00:00Z"}


@app.get("/api/chat/{chat_id}/messages")
async def get_chat_messages(chat_id: str, authorization: Optional[str] = Header(None)):
    """Get messages from a chat"""
    verify_token(authorization)

    # Return mock messages or empty list
    messages = CHAT_MESSAGES_DB.get(chat_id, [])
    return messages


@app.post("/api/internal/tools/booking-status")
async def get_booking_status(
    request: BookingStatusRequest, authorization: Optional[str] = Header(None)
):
    """Get booking status for a specific booking ID"""
    verify_token(authorization)

    booking = BOOKINGS_DB.get(request.booking_id)

    if not booking:
        raise HTTPException(
            status_code=404, detail=f"Booking {request.booking_id} not found"
        )

    # Verify user owns this booking
    if booking["user_id"] != request.user_id:
        raise HTTPException(
            status_code=403, detail="You don't have access to this booking"
        )

    return {
        "booking_id": booking["booking_id"],
        "timeslot": booking["timeslot"],
        "status": booking["status"],
    }


@app.post("/api/internal/tools/user-bookings")
async def get_user_bookings(
    request: UserBookingsRequest, authorization: Optional[str] = Header(None)
):
    """Get all bookings for a user on a specific date and hour"""
    verify_token(authorization)

    # Filter bookings by user_id, date, and hour
    user_bookings = []

    for booking_id, booking in BOOKINGS_DB.items():
        if (
            booking["user_id"] == request.user_id
            and booking["timeslot"]["date"] == request.date
            and booking["timeslot"]["hour_start"] == request.hour
        ):

            user_bookings.append(
                {
                    "booking_id": booking["booking_id"],
                    "timeslot": booking["timeslot"],
                    "status": booking["status"],
                }
            )

    return user_bookings


@app.post("/api/internal/tools/port-schedule")
async def get_port_schedule(
    request: PortScheduleRequest, authorization: Optional[str] = Header(None)
):
    """Get port schedule for a terminal on a specific date"""
    verify_token(authorization)

    terminal_schedules = TERMINAL_SCHEDULES.get(request.terminal_id)

    if not terminal_schedules:
        raise HTTPException(
            status_code=404, detail=f"Terminal {request.terminal_id} not found"
        )

    schedule = terminal_schedules.get(request.date)

    if not schedule:
        # Return empty schedule for dates not in our mock data
        schedule = []

    return {"date": request.date, "schedule": schedule}


# ============================================================================
# ADDITIONAL ENDPOINTS (for future expansion)
# ============================================================================


@app.get("/api/terminals")
async def list_terminals(authorization: Optional[str] = Header(None)):
    """List all available terminals"""
    verify_token(authorization)

    return {
        "terminals": [
            {"terminal_id": "T1", "name": "Terminal A", "capacity": 10},
            {"terminal_id": "T2", "name": "Terminal B", "capacity": 15},
        ]
    }


@app.get("/api/users/{user_id}/bookings")
async def get_all_user_bookings(
    user_id: str, authorization: Optional[str] = Header(None)
):
    """Get all bookings for a user (all dates)"""
    verify_token(authorization)

    user_bookings = []

    for booking_id, booking in BOOKINGS_DB.items():
        if booking["user_id"] == user_id:
            user_bookings.append(
                {
                    "booking_id": booking["booking_id"],
                    "timeslot": booking["timeslot"],
                    "status": booking["status"],
                    "terminal_id": booking["terminal_id"],
                }
            )

    return {"bookings": user_bookings}


@app.post("/api/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: str, authorization: Optional[str] = Header(None)):
    """Cancel a booking (mock implementation)"""
    verify_token(authorization)

    if booking_id not in BOOKINGS_DB:
        raise HTTPException(status_code=404, detail=f"Booking {booking_id} not found")

    # Mock cancellation
    BOOKINGS_DB[booking_id]["status"] = "cancelled"

    return {
        "booking_id": booking_id,
        "status": "cancelled",
        "message": "Booking cancelled successfully",
    }


@app.post("/api/bookings/{booking_id}/reschedule")
async def reschedule_booking(
    booking_id: str,
    new_date: str,
    new_hour: str,
    authorization: Optional[str] = Header(None),
):
    """Reschedule a booking (mock implementation)"""
    verify_token(authorization)

    if booking_id not in BOOKINGS_DB:
        raise HTTPException(status_code=404, detail=f"Booking {booking_id} not found")

    # Mock rescheduling
    BOOKINGS_DB[booking_id]["timeslot"]["date"] = new_date
    BOOKINGS_DB[booking_id]["timeslot"]["hour_start"] = new_hour
    BOOKINGS_DB[booking_id]["status"] = "confirmed"

    return {
        "booking_id": booking_id,
        "timeslot": BOOKINGS_DB[booking_id]["timeslot"],
        "status": "confirmed",
        "message": "Booking rescheduled successfully",
    }


# ============================================================================
# DEBUG ENDPOINTS
# ============================================================================


@app.get("/debug/bookings")
async def debug_list_all_bookings():
    """List all bookings (for debugging)"""
    return BOOKINGS_DB


@app.get("/debug/schedules")
async def debug_list_all_schedules():
    """List all terminal schedules (for debugging)"""
    return TERMINAL_SCHEDULES


@app.post("/debug/add-booking")
async def debug_add_booking(
    booking_id: str,
    user_id: str,
    date: str,
    hour: str,
    terminal_id: str = "T1",
    status: str = "confirmed",
):
    """Add a booking to the mock database (for debugging)"""
    BOOKINGS_DB[booking_id] = {
        "booking_id": booking_id,
        "user_id": user_id,
        "timeslot": {"date": date, "hour_start": hour},
        "status": status,
        "terminal_id": terminal_id,
    }

    return {"message": "Booking added", "booking": BOOKINGS_DB[booking_id]}


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("Starting Mock API Server")
    print("=" * 70)
    print()
    print("Server: http://localhost:8000")
    print("Docs:   http://localhost:8000/docs")
    print("Debug:  http://localhost:8000/debug/bookings")
    print()
    print("Token:  mock-service-token")
    print()
    print("Available endpoints:")
    print("  • GET  /api/chat/{chat_id}/messages")
    print("  • POST /api/internal/tools/booking-status")
    print("  • POST /api/internal/tools/user-bookings")
    print("  • POST /api/internal/tools/port-schedule")
    print()
    print("Sample bookings:")
    for bid, booking in list(BOOKINGS_DB.items())[:3]:
        print(
            f"  • {bid}: {booking['status']} - {booking['timeslot']['date']} {booking['timeslot']['hour_start']}:00"
        )
    print()
    print("=" * 70)
    print()

    uvicorn.run(app, host="0.0.0.0", port=8000)
