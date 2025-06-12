import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaMinus, FaExpand } from 'react-icons/fa';
import AIChat from './AIChat';

interface AIChatWidgetProps {
  context?: {
    module?: 'edr' | 'emo' | 'gosellr' | 'wallet' | 'franchise';
    page?: string;
    filters?: Record<string, any>;
  };
}

export default function AIChatWidget({ context }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get context-aware title
  const getTitle = () => {
    if (!context?.module) return 'EHB Assistant';

    switch (context.module) {
      case 'edr':
        return 'Education Assistant';
      case 'emo':
        return 'Health Assistant';
      case 'gosellr':
        return 'Shopping Assistant';
      case 'wallet':
        return 'Wallet Assistant';
      case 'franchise':
        return 'Franchise Assistant';
      default:
        return 'EHB Assistant';
    }
  };

  // Get context-aware welcome message
  const getWelcomeMessage = () => {
    if (!context?.module) return 'How can I help you today?';

    switch (context.module) {
      case 'edr':
        return 'Need help finding a tutor or course?';
      case 'emo':
        return 'Looking for a doctor or health service?';
      case 'gosellr':
        return 'What would you like to shop for?';
      case 'wallet':
        return 'Need help with your wallet or coins?';
      case 'franchise':
        return 'Interested in becoming a franchise partner?';
      default:
        return 'How can I help you today?';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white rounded-lg shadow-xl ${isExpanded ? 'w-[800px]' : 'w-[400px]'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <FaRobot className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{getTitle()}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <FaMinus className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <FaExpand className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Chat Interface */}
            {!isMinimized && (
              <div className={`${isExpanded ? 'h-[600px]' : 'h-[400px]'}`}>
                <AIChat initialMessage={getWelcomeMessage()} context={context} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <FaRobot className="w-5 h-5" />
          <span>Ask EHB</span>
        </motion.button>
      )}
    </div>
  );
}
