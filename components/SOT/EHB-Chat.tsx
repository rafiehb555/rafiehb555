import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiMessageSquare, FiInfo } from 'react-icons/fi';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface UserProfile {
  id: string;
  name: string;
  sqlLevel: string;
  jpsProfile: {
    skills: string[];
    experience: string;
  };
}

// Mock data - replace with API calls
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'ai',
    timestamp: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    content: 'I need help with my SQL level upgrade',
    sender: 'user',
    timestamp: '2024-03-15T10:31:00Z',
  },
];

const mockUserProfile: UserProfile = {
  id: 'user123',
  name: 'John Doe',
  sqlLevel: 'Normal',
  jpsProfile: {
    skills: ['Web Development', 'UI/UX Design', 'Project Management'],
    experience: '5 years',
  },
};

export default function EHBChat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // TODO: Implement API call to get AI response
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a simulated AI response. The actual AI integration is pending.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* User Profile Panel */}
      <div className="w-80 border-l border-gray-200 bg-white p-6">
        <div className="space-y-6">
          {/* User Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h2>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{mockUserProfile.name}</p>
                <p className="text-sm text-gray-500">ID: {mockUserProfile.id}</p>
              </div>
            </div>
          </div>

          {/* SQL Level */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">SQL Level</h3>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-800 font-medium">{mockUserProfile.sqlLevel}</p>
            </div>
          </div>

          {/* JPS Profile */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">JPS Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="text-gray-900">{mockUserProfile.jpsProfile.experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mockUserProfile.jpsProfile.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FiInfo className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900 font-medium">AI Chat Support</p>
                <p className="text-sm text-gray-500 mt-1">
                  This chat is powered by AI and can help you with various tasks and queries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
