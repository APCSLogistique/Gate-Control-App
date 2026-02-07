import httpx
from typing import List, Dict, Any
from config import get_settings
from models import (
    Booking,
    PortSchedule,
    ChatMessage,
)

settings = get_settings()
base_url = settings.api_base_url
headers = {
    "Authorization": f"Bearer {settings.api_service_token}",
    "Content-Type": "application/json",
}


async def get_chat_messages(chat_id: str) -> List[ChatMessage]:
    """Get messages from a chat"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{base_url}/api/chat/{chat_id}/messages", headers=headers
        )
        response.raise_for_status()
        data = response.json()
        return [ChatMessage(**msg) for msg in data]


async def get_booking_status(booking_id: str, user_id: str) -> Booking:
    """Get booking status"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/api/internal/tools/booking-status",
            json={"booking_id": booking_id, "user_id": user_id},
            headers=headers,
        )
        response.raise_for_status()
        return Booking(**response.json())


async def get_user_bookings(user_id: str, date: str, hour: str) -> List[Booking]:
    """Get user bookings for a specific date and hour"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/api/internal/tools/user-bookings",
            json={"user_id": user_id, "date": date, "hour": hour},
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        return [Booking(**booking) for booking in data]


async def get_port_schedule(date: str) -> PortSchedule:
    """Get port schedule for a terminal"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/api/internal/tools/port-schedule",
            json={
                "date": date,
            },
            headers=headers,
        )
        response.raise_for_status()
        return PortSchedule(**response.json())
