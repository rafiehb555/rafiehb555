import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiSmartphone, FiShield, FiZap } from 'react-icons/fi';

const features = [
  {
    icon: <FiSmartphone className="w-6 h-6" />,
    title: 'Mobile First',
    description: 'Optimized for all devices',
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: 'Secure',
    description: 'Bank-grade security',
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    title: 'Fast',
    description: 'Lightning quick performance',
  },
];

export default function MobileAppCTA() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - App Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative w-full max-w-sm mx-auto">
              <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl" />
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="aspect-[9/16] bg-gradient-to-b from-blue-400/20 to-indigo-500/20 rounded-2xl" />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get the EHB Mobile App</h2>
            <p className="text-lg text-blue-100 mb-8">
              Download our mobile app to access all EHB services on the go. Manage your franchise,
              track sales, and connect with customers anytime, anywhere.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-blue-100">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <FiDownload className="mr-2" />
                Download for iOS
              </button>
              <button className="flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <FiDownload className="mr-2" />
                Download for Android
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
