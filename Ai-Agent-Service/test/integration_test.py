"""
Pytest Integration Tests for AI Agent with Mock API

Run with: pytest test_integration.py -v
Run with output: pytest test_integration.py -v -s
"""

import pytest
import requests
import time
from typing import Dict, List


# Test configuration
AI_URL = "http://localhost:8001/api/ai/generate"
MOCK_API_URL = "http://localhost:8000"
TIMEOUT = 30


@pytest.fixture(scope="session")
def check_services():
    """Check if both services are running before tests"""
    try:
        # Check Mock API
        response = requests.get(f"{MOCK_API_URL}/", timeout=5)
        assert response.status_code == 200, "Mock API not running"

        # Check AI Agent Service
        response = requests.get("http://localhost:8001/", timeout=5)
        assert response.status_code == 200, "AI Agent Service not running"

        print("\n✅ Both services are running")
        return True
    except Exception as e:
        pytest.fail(
            f"\n❌ Services not running. Start them with: ./start_with_mock.sh\nError: {e}"
        )


@pytest.fixture
def ai_client(check_services):
    """Fixture that provides an AI client"""

    def send_message(message: str) -> Dict:
        response = requests.post(
            AI_URL,
            json={"chat_id": "chat_abc123", "message": message, "user_id": "U456"},
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response.json()

    return send_message


class TestMockAPIDirectly:
    """Test the mock API directly"""

    def test_mock_api_health(self):
        """Test mock API health endpoint"""
        response = requests.get(f"{MOCK_API_URL}/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "Mock API" in data["service"]

    def test_get_booking_status(self):
        """Test booking status endpoint"""
        response = requests.post(
            f"{MOCK_API_URL}/api/internal/tools/booking-status",
            json={"booking_id": "BK123", "user_id": "U456"},
            headers={"Authorization": "Bearer mock-service-token"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["booking_id"] == "BK123"
        assert data["status"] == "confirmed"

    def test_get_user_bookings(self):
        """Test user bookings endpoint"""
        response = requests.post(
            f"{MOCK_API_URL}/api/internal/tools/user-bookings",
            json={"user_id": "U456", "date": "2024-02-07", "hour": "14"},
            headers={"Authorization": "Bearer mock-service-token"},
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_get_port_schedule(self):
        """Test port schedule endpoint"""
        response = requests.post(
            f"{MOCK_API_URL}/api/internal/tools/port-schedule",
            json={
                "terminal_id": "T1",
                "date": "2024-02-07",
                "user_id": "U456",
                "user_role": "operator",
            },
            headers={"Authorization": "Bearer mock-service-token"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["date"] == "2024-02-07"
        assert "schedule" in data
        assert len(data["schedule"]) > 0


class TestAIAgentSimpleQueries:
    """Test simple AI agent queries"""

    def test_booking_status_query(self, ai_client):
        """Test: What is the status of booking BK123?"""
        result = ai_client("What is the status of booking BK123?")

        assert "message" in result
        response = result["message"].lower()
        assert "bk123" in response
        assert "confirmed" in response

    def test_show_booking_variation(self, ai_client):
        """Test: Show me BK123 (natural variation)"""
        result = ai_client("Show me BK123")

        assert "message" in result
        response = result["message"].lower()
        assert "bk123" in response

    def test_check_booking_variation(self, ai_client):
        """Test: Check booking BK123 (natural variation)"""
        result = ai_client("Check booking BK123")

        assert "message" in result
        response = result["message"].lower()
        assert "bk123" in response

    def test_different_booking_id(self, ai_client):
        """Test: Status of BK456"""
        result = ai_client("Status of BK456")

        assert "message" in result
        response = result["message"].lower()
        assert "bk456" in response
        assert "confirmed" in response

    def test_pending_booking(self, ai_client):
        """Test: What's the status of BK789? (pending booking)"""
        result = ai_client("What's the status of BK789?")

        assert "message" in result
        response = result["message"].lower()
        assert "bk789" in response
        assert "pending" in response


class TestAIAgentComplexQueries:
    """Test complex AI agent queries"""

    def test_user_bookings_query(self, ai_client):
        """Test: What are my bookings today at 2pm?"""
        result = ai_client("What are my bookings today at 2pm?")

        assert "message" in result
        response = result["message"].lower()
        # Should mention BK123 which is at 14:00 (2pm)
        assert "bk123" in response or "14" in response or "2" in response

    def test_terminal_availability(self, ai_client):
        """Test: Show me available slots at Terminal T1 for tomorrow"""
        result = ai_client("Show me available slots at Terminal T1 for tomorrow")

        assert "message" in result
        response = result["message"].lower()
        assert "t1" in response or "terminal" in response
        assert "available" in response or "slot" in response

    def test_terminal_t2_schedule(self, ai_client):
        """Test: What's the schedule for Terminal T2 today?"""
        result = ai_client("What's the schedule for Terminal T2 today?")

        assert "message" in result
        response = result["message"].lower()
        assert "t2" in response or "terminal" in response

    @pytest.mark.slow
    def test_multi_step_reschedule(self, ai_client):
        """Test: I want to reschedule BK123 to tomorrow, show me options"""
        result = ai_client("I want to reschedule BK123 to tomorrow, show me options")

        assert "message" in result
        response = result["message"].lower()
        # Should mention current booking and available slots
        assert "bk123" in response
        # Should have information about tomorrow
        assert (
            "tomorrow" in response
            or "2024-02-08" in response
            or "available" in response
        )


class TestAIAgentGeneralQueries:
    """Test general queries that don't need tools"""

    def test_general_question(self, ai_client):
        """Test: What is a port terminal? (no tool needed)"""
        result = ai_client("What is a port terminal?")

        assert "message" in result
        response = result["message"].lower()
        assert "terminal" in response or "port" in response
        # Should respond without error
        assert len(response) > 10


class TestNaturalLanguageVariations:
    """Test that MCP handles natural language variations"""

    @pytest.mark.parametrize(
        "message",
        [
            "Status of BK123",
            "Show me BK123",
            "Check booking BK123",
            "Tell me about BK123",
            "What about BK123?",
            "BK123 status please",
        ],
    )
    def test_booking_variations(self, ai_client, message):
        """Test various ways to ask about booking BK123"""
        result = ai_client(message)

        assert "message" in result
        response = result["message"].lower()
        assert "bk123" in response
        # All variations should successfully get booking info
        assert len(response) > 20


class TestErrorHandling:
    """Test error handling"""

    def test_nonexistent_booking(self, ai_client):
        """Test: Status of BK999999 (doesn't exist)"""
        # BK999999 doesn't exist in mock data
        result = ai_client("What is the status of booking BK999999?")

        assert "message" in result
        # Should handle gracefully, not crash
        response = result["message"].lower()
        assert "bk999999" in response or "not found" in response or "error" in response


class TestPerformance:
    """Test performance characteristics"""

    def test_simple_query_performance(self, ai_client):
        """Test that simple queries complete in reasonable time"""
        start = time.time()
        result = ai_client("Status of BK123")
        elapsed = time.time() - start

        assert "message" in result
        # Should complete in under 30 seconds (generous timeout)
        assert elapsed < 30
        print(f"\n⏱️  Query took {elapsed:.2f}s")

    @pytest.mark.slow
    def test_complex_query_performance(self, ai_client):
        """Test that complex queries complete in reasonable time"""
        start = time.time()
        result = ai_client("I want to reschedule BK123, show me tomorrow's options")
        elapsed = time.time() - start

        assert "message" in result
        # Complex queries may take longer but should still complete
        assert elapsed < 45
        print(f"\n⏱️  Complex query took {elapsed:.2f}s")


class TestChatHistory:
    """Test chat history context"""

    def test_conversation_context(self, ai_client):
        """Test that multiple messages in same chat work"""
        chat_id = f"test_context_{int(time.time())}"

        # First message
        result1 = ai_client("Status of BK123", chat_id=chat_id)
        assert "message" in result1

        # Second message in same chat
        result2 = ai_client("What about BK456?", chat_id=chat_id)
        assert "message" in result2

        # Both should work independently
        assert "bk456" in result2["message"].lower()


# Markers for different test types
pytestmark = pytest.mark.integration


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
