import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your APCS AI Assistant. How can I help you today?',
      time: '10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');

  const suggestedQuestions = [
    'Is there space at Terminal A tomorrow?',
    'What is the status of my booking B-2024-001?',
    'Show me available slots for Terminal B today',
    'How many trucks are currently in the port?',
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: 'I\'ve found that information for you. Terminal A has 12 available slots for tomorrow between 8 AM and 6 PM.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-deep-ocean flex items-center gap-3">
          <Sparkles className="text-digital-cyan" size={32} />
          AI Logistics Assistant
        </h1>
        <p className="text-gray-500 mt-1">Conversational self-service access to port information</p>
      </div>

      {/* Suggested Questions */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Suggested Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              className="text-left p-3 bg-light-blue hover:bg-blue-100 rounded-lg text-sm text-gray-700 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-apcs-blue' : 'bg-digital-cyan'
                }`}>
                  {message.role === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                <div>
                  <div
                    className={`p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-apcs-blue text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about port operations..."
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Send size={18} />
            Send
          </button>
        </form>
      </div>

    </div>
  );
};

export default AIAssistant;
