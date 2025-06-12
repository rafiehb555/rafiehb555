import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface NewsItem {
  id: number;
  text: string;
  type: 'announcement' | 'update' | 'event';
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    text: 'New GoSellr features now available!',
    type: 'announcement',
  },
  {
    id: 2,
    text: 'EHB AI Marketplace launching next month',
    type: 'update',
  },
  {
    id: 3,
    text: 'Franchise opportunities now open in multiple cities',
    type: 'event',
  },
  {
    id: 4,
    text: 'System maintenance scheduled for next week',
    type: 'announcement',
  },
];

const getTypeColor = (type: NewsItem['type']) => {
  switch (type) {
    case 'announcement':
      return 'bg-blue-500';
    case 'update':
      return 'bg-green-500';
    case 'event':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export default function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % newsItems.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % newsItems.length);
  };

  return (
    <div className="bg-gray-100 py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 mr-4">Latest News:</span>
          <div className="relative h-6 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center"
              >
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs text-white mr-2 ${getTypeColor(
                    newsItems[currentIndex].type
                  )}`}
                >
                  {newsItems[currentIndex].type}
                </span>
                <span className="text-gray-600">{newsItems[currentIndex].text}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
