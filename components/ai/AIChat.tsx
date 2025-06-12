import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import { detectLanguage } from '@/lib/utils/languageUtils';
import { detectIntent } from '@/lib/ai/intentRouter';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intent?: {
    type: 'education' | 'health' | 'shopping' | 'general';
    service?: string;
    filters?: {
      subject?: string;
      city?: string;
      price?: number;
      sqlLevel?: number;
    };
  };
}

interface AIChatProps {
  initialMessage?: string;
  context?: {
    module?: 'edr' | 'emo' | 'gosellr' | 'wallet' | 'franchise';
    page?: string;
    filters?: Record<string, any>;
  };
}

export default function AIChat({ initialMessage, context }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialMessage) {
      return [
        {
          id: 'welcome',
          content: initialMessage,
          sender: 'ai',
          timestamp: new Date(),
        },
      ];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Detect language
      const language = await detectLanguage(input);

      // Detect intent and get AI response
      const { intent, response } = await detectIntent(input, language);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        intent,
      };

      setMessages(prev => [...prev, aiMessage]);

      // If intent is detected, handle navigation or action
      if (intent) {
        handleIntent(intent);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleIntent = (intent: Message['intent']) => {
    if (!intent) return;

    // Handle different intents
    switch (intent.type) {
      case 'education':
        if (intent.service === 'tutor') {
          // Navigate to tutor search with filters
          const queryParams = new URLSearchParams();
          if (intent.filters?.subject) queryParams.set('subject', intent.filters.subject);
          if (intent.filters?.city) queryParams.set('city', intent.filters.city);
          if (intent.filters?.price) queryParams.set('maxPrice', intent.filters.price.toString());
          window.location.href = `/edr?${queryParams.toString()}`;
        }
        break;
      case 'health':
        // Navigate to EMO
        window.location.href = '/emo';
        break;
      case 'shopping':
        // Navigate to GoSellr
        window.location.href = '/gosellr';
        break;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {message.sender === 'ai' ? (
                    <FaRobot className="w-4 h-4 text-blue-500" />
                  ) : (
                    <FaUser className="w-4 h-4 text-white" />
                  )}
                  <span className="text-sm font-medium">
                    {message.sender === 'ai' ? 'EHB Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
                {message.intent && (
                  <div className="mt-2 text-xs text-gray-500">
                    Detected: {message.intent.type}
                    {message.intent.service && ` → ${message.intent.service}`}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FaSpinner className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-sm text-gray-500">Typing...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
