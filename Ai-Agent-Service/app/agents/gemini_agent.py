from pprint import pprint
from google import genai
from google.genai import types
from typing import List, Dict, Any
from models import ChatMessage
from agents.base import AgentInterface
from config import get_settings
from tools import get_booking_status, get_port_schedule, get_user_bookings


class GeminiAgent(AgentInterface):
    """Gemini AI agent implementation with native function calling"""

    def __init__(self):
        self.settings = get_settings()
        self.client = genai.Client(api_key=self.settings.gemini_api_key)

        self.system_prompt = self._load_system_prompt()

        self.config = types.GenerateContentConfig(
            tools=[
                get_booking_status,
                get_port_schedule,
                get_user_bookings,
            ],
            automatic_function_calling={"disable": True},
        )

        self.model = "gemini-2.0-flash-lite"

    async def generate(
        self,
        message: str,
        chat_history: List[ChatMessage],
        user_id: str,
        tools: List[Dict[str, Any]],
    ) -> str:
        """Generate response using Gemini with native function calling"""
        try:
            print("Got into generate success")

            contents = self._build_chat_history(
                chat_history=chat_history, user_id=user_id
            )
            contents.append(
                types.Content(role="user", parts=[types.Part(text=message)])
            )

            print("Built History")

            max_iterations = 1
            for i in range(max_iterations):
                # Use client.aio for non-blocking async calls
                response = await self.client.aio.models.generate_content(
                    model=self.model, contents=contents, config=self.config
                )

                # Add the model's response (text or function call) to history
                model_content = response.candidates[0].content
                contents.append(model_content)

                # Check if the model wants to call a function
                function_calls = [
                    p.function_call for p in model_content.parts if p.function_call
                ]

                if not function_calls:
                    # No function calls? We have the final text response.
                    print("Got final text response", flush=True)
                    print(f"[RESPONSE] {response.text}")
                    return response.text

                # 3. Handle Function Calls
                print(f"Model requested {len(function_calls)} tool(s)", flush=True)
                tool_responses = []

                for fc in function_calls:
                    # Execute your async tool functions
                    result = await self._execute_function(fc.name, dict(fc.args))

                    # Format response correctly for Gemini
                    tool_responses.append(
                        types.Part(
                            function_response=types.FunctionResponse(
                                name=fc.name, response={"result": result}
                            )
                        )
                    )

                # Send function results back in the next loop iteration
                contents.append(types.Content(role="user", parts=tool_responses))
                print(f"Sent tool results back to model (Iteration {i+1})", flush=True)

            return "I'm sorry, I reached my maximum reasoning limit for this request."

        except Exception as e:
            print("Generate ERROR")
            pprint(str(e))
            raise Exception(f"Error whilst generating the response {str(e)}")

    def _build_chat_history(
        self, chat_history: List[ChatMessage], user_id: str
    ) -> List[Dict[str, Any]]:
        """Build Gemini chat history format"""
        history = []

        # Add system instruction as first user message
        if chat_history:
            history.append(
                types.Content(
                    role="user",
                    parts=[
                        types.Part(text=self.system_prompt),
                        types.Part(text=f"The Current User's Id is: {user_id}"),
                    ],
                )
            )
            history.append(
                types.Content(
                    role="model",
                    parts=[
                        types.Part(
                            text="I understand. I'll help you with your port booking needs"
                        )
                    ],
                )
            )

        # Add conversation history (last 10 messages)
        for msg in chat_history[-10:]:
            role = "user" if msg.sender == "user" else "model"
            history.append(
                types.Content(role=role, parts=[types.Part(text=msg.message)])
            )

        return history

    async def _execute_function(
        self, function_name: str, args: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute a function call and return the result"""

        try:
            if function_name == "get_booking_status":
                booking = await get_booking_status(
                    booking_id=args["booking_id"],
                    user_id=args.get("user_id", "U456"),  # Default user for MVP
                )
                return {
                    "booking_id": booking.booking_id,
                    "status": booking.status,
                    "date": booking.timeslot.date,
                    "hour": booking.timeslot.hour_start,
                }

            elif function_name == "get_user_bookings":
                bookings = await get_user_bookings(
                    user_id=args.get("user_id", "U456"),
                    date=args["date"],
                    hour=args["hour"],
                )
                return {
                    "bookings": [
                        {
                            "booking_id": b.booking_id,
                            "status": b.status,
                            "date": b.timeslot.date,
                            "hour": b.timeslot.hour_start,
                        }
                        for b in bookings
                    ]
                }

            elif function_name == "get_port_schedule":
                schedule = await get_port_schedule(date=args["date"])
                return {
                    "date": schedule.date,
                    "slots": [
                        {
                            "hour": slot.hour_start,
                            "max_capacity": slot.max_capacity,
                            "booked_capacity": slot.booked_capacity,
                            "available": slot.max_capacity - slot.booked_capacity,
                        }
                        for slot in schedule.schedule
                    ],
                }

            else:
                return {"error": f"Unknown function: {function_name}"}

        except Exception as e:
            return {"error": str(e)}
