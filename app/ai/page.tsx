'use client';

import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';
import AIChat from '@/components/ai/AIChat';

export default function AIPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaRobot className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">EHB AI Assistant</h1>
          </div>
          <p className="text-gray-600">
            Ask me anything about education, health, or shopping services. I can help you find
            tutors, doctors, or products across Pakistan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AIChat />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Supports English, Urdu, and Roman Urdu</p>
          <p className="mt-2">
            Try asking: "Find me a math tutor in Karachi" or "Show me doctors in Lahore"
          </p>
        </motion.div>
      </div>
    </div>
  );
}
