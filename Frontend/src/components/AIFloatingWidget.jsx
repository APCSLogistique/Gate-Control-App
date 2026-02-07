import { useState } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AIFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useAuth();

  // Role-specific quick suggestions
  const quickSuggestions = {
    operator: [
      'Show pending bookings',
      'How many trucks in port?',
      'Terminal A status',
    ],
    carrier: [
      'Available slots today?',
      'Show my bookings',
      'Best time this week?',
    ],
    admin: [
      'Terminal utilization',
      'Today\'s operations',
      'Capacity optimization',
    ],
  };

  const suggestions = quickSuggestions[user?.role] || [];

  const handleSend = (message) => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: `I can help you with that. Let me check the information for you...`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-digital-cyan hover:bg-apcs-blue text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        title="AI Assistant"
      >
        <Sparkles size={24} />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        isMinimized ? 'bottom-6 right-6 w-80 h-16' : 'bottom-6 right-6 w-96 h-[600px]'
      } bg-white rounded-lg shadow-2xl flex flex-col transition-all z-50 border border-gray-200`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-apcs-blue to-digital-cyan text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Suggestions */}
          {messages.length === 0 && (
            <div className="p-4 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(suggestion)}
                    className="w-full text-left text-sm p-2 bg-light-blue hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <Sparkles size={32} className="mx-auto mb-2 text-digital-cyan" />
                <p className="text-sm">Ask me anything about port operations</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-apcs-blue text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apcs-blue focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="bg-apcs-blue hover:bg-deep-ocean text-white p-2 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AIFloatingWidget;
