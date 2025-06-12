import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

interface Brand {
  id: string;
  name: string;
  logo: string;
  rating: number;
  category: string;
  url: string;
}

const brands: Brand[] = [
  {
    id: '1',
    name: 'TechGadgets Pro',
    logo: '/brands/tech-gadgets.png',
    rating: 4.9,
    category: 'Electronics',
    url: '/brands/tech-gadgets-pro',
  },
  {
    id: '2',
    name: 'Fashion Forward',
    logo: '/brands/fashion-forward.png',
    rating: 4.8,
    category: 'Fashion',
    url: '/brands/fashion-forward',
  },
  {
    id: '3',
    name: 'Home Essentials',
    logo: '/brands/home-essentials.png',
    rating: 4.7,
    category: 'Home & Living',
    url: '/brands/home-essentials',
  },
  {
    id: '4',
    name: 'Beauty Box',
    logo: '/brands/beauty-box.png',
    rating: 4.9,
    category: 'Beauty',
    url: '/brands/beauty-box',
  },
  {
    id: '5',
    name: 'Sports Elite',
    logo: '/brands/sports-elite.png',
    rating: 4.8,
    category: 'Sports',
    url: '/brands/sports-elite',
  },
];

export default function TopBrandsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % brands.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev - 1 + brands.length) % brands.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev + 1) % brands.length);
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Verified Sellers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most trusted and highest-rated sellers on the platform.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-[400px] overflow-hidden rounded-xl bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 p-8"
              >
                <Link href={brands[currentIndex].url}>
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 mb-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-full" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {brands[currentIndex].name}
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(brands[currentIndex].rating) ? 'fill-current' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">{brands[currentIndex].rating}</span>
                    </div>
                    <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {brands[currentIndex].category}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {brands.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
