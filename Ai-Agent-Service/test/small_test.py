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


# Markers for different test types
pytestmark = pytest.mark.integration


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
