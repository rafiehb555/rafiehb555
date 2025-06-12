'use client';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/home/SearchBar';
import ServiceSlider from '../components/home/ServiceSlider';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { MODULES } from '../lib/constants';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />

      {/* Search Section */}
      <div className="py-12 bg-gradient-to-b from-blue-50 to-white">
        <SearchBar />
      </div>

      {/* Service Slider */}
      <div className="py-12">
        <ServiceSlider />
      </div>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Modules Grid */}
      <div id="modules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">All Services</h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {Object.values(MODULES).map(module => (
            <motion.a
              key={module.name}
              href={module.path}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${module.color} rounded-lg shadow-lg overflow-hidden transform transition duration-300`}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{module.name}</h3>
                <p className="text-white opacity-90">{module.description}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>© 2024 EHB Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
