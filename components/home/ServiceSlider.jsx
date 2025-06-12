'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
  {
    id: 1,
    title: 'GoSellr Marketplace',
    description: 'Start your online business today',
    image: '🛍️',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'EDR Learning',
    description: 'Access world-class education',
    image: '📚',
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'EMO Health',
    description: 'Your health, our priority',
    image: '🏥',
    color: 'bg-red-500',
  },
  {
    id: 4,
    title: 'JPS Services',
    description: 'Justice at your fingertips',
    image: '⚖️',
    color: 'bg-purple-500',
  },
];

export default function ServiceSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + services.length) % services.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-64">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 ${services[currentIndex].color} rounded-lg shadow-lg p-8`}
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{services[currentIndex].title}</h3>
              <p className="text-white opacity-90">{services[currentIndex].description}</p>
            </div>
            <div className="text-6xl">{services[currentIndex].image}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
      >
        →
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
