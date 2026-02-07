from abc import ABC, abstractmethod
from typing import List, Dict, Any
from models import ChatMessage


class AgentInterface(ABC):
    """Abstract base class for AI agents"""

    @abstractmethod
    async def generate(
        self, message: str, chat_history: List[ChatMessage], tools: List[Dict[str, Any]]
    ) -> str:
        """
        Generate a response from the AI agent

        Args:
            message: The user's message
            chat_history: Previous conversation history
            tools: Available tools for the agent to use

        Returns:
            The agent's response
        """
        pass

    def _load_system_prompt(self) -> str:
        """Load system prompt from file"""
        try:
            with open("prompts/system_prompt.txt", "r") as f:
                return f.read()
        except FileNotFoundError:
            return "You are a helpful AI assistant for a port booking system."
