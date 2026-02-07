"""
EXPERIMENTAL MODULE  === HAS NO TEST COVERAGE

The ollama agent implementation has not been tested either a devlopment or production environment,
Thus this module is currently only experimental and should be tested before being labeled as finished
"""

import json
import ollama
from typing import List, Dict, Any
from app.tools import get_booking_status, get_port_schedule, get_user_bookings
from models import ChatMessage
from agents.base import AgentInterface
from config import get_settings


class LlamaAgent(AgentInterface):
    """Llama AI agent implementation using Ollama"""

    def __init__(self):
        self.settings = get_settings()
        self.model = self.settings.ollama_model
        self.system_prompt = self._load_system_prompt()

    async def generate(
        self, message: str, chat_history: List[ChatMessage], tools: List[Dict[str, Any]]
    ) -> str:
        """Generate response using Llama via Ollama"""

        # Build conversation
        conversation = self._build_conversation(chat_history, message)

        # Generate with tool calling
        response = await self._generate_with_tools(conversation, message)

        return response

    def _build_conversation(
        self, chat_history: List[ChatMessage], current_message: str
    ) -> str:
        """Build conversation context"""
        context = f"{self.system_prompt}\n\n=== Conversation History ===\n"

        for msg in chat_history[-10:]:  # Last 10 messages
            sender = "User" if msg.sender == "human" else "Assistant"
            context += f"{sender}: {msg.message}\n"

        context += f"\nUser: {current_message}\nAssistant:"
        return context

    async def _generate_with_tools(self, context: str, user_message: str) -> str:
        """Generate response with tool calling capability"""

        response_text = ""

        # Simple keyword-based tool detection for MVP
        # Check if user is asking about booking status
        if "booking" in user_message.lower() and any(
            word in user_message.lower()
            for word in ["status", "check", "what", "where"]
        ):
            words = user_message.split()
            for word in words:
                if word.startswith("BK") or word.startswith("bk"):
                    try:
                        booking = await get_booking_status(word.upper(), "U456")
                        response_text = (
                            f"Booking {booking.booking_id} is {booking.status}. "
                        )
                        response_text += f"Scheduled for {booking.timeslot.date} at hour {booking.timeslot.hour_start}:00."
                        return response_text
                    except Exception as e:
                        pass

        # Check if user is asking about their bookings
        if any(
            word in user_message.lower()
            for word in ["my bookings", "my appointments", "today"]
        ):
            try:
                from datetime import date

                today = date.today().isoformat()
                bookings = await get_user_bookings("U456", today, "14")

                if bookings:
                    response_text = f"You have {len(bookings)} booking(s) today:\n"
                    for booking in bookings:
                        response_text += f"- {booking.booking_id}: {booking.status} at {booking.timeslot.hour_start}:00\n"
                    return response_text.strip()
                else:
                    return "You have no bookings for today."
            except Exception as e:
                pass

        # Check for schedule/availability
        if any(
            word in user_message.lower()
            for word in ["available", "schedule", "slots", "capacity"]
        ):
            try:
                from datetime import date

                today = date.today().isoformat()

                schedule = await get_port_schedule(today)

                response_text = f"Schedule on {schedule.date}:\n"

                for slot in schedule.schedule[:5]:
                    available = slot.max_capacity - slot.booked_capacity
                    response_text += f"Hour {slot.hour_start}:00 - {available}/{slot.max_capacity} slots available\n"

                return response_text.strip()
            except Exception as e:
                pass

        # Fallback to Llama generation
        try:
            response = ollama.generate(model=self.model, prompt=context)
            return response["response"]
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}. Please try rephrasing your question."
