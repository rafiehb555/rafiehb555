import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

interface FranchiseType {
  id: string;
  name: string;
  description: string;
  investment: string;
  benefits: string[];
  color: string;
}

const franchiseTypes: FranchiseType[] = [
  {
    id: 'sub',
    name: 'Sub Franchise',
    description: 'Start your journey with a single location',
    investment: '$10,000 - $50,000',
    benefits: [
      'Single location operation',
      'Basic training and support',
      'Local marketing assistance',
      'Standard operating procedures',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'master',
    name: 'Master Franchise',
    description: 'Expand your business across a region',
    investment: '$100,000 - $500,000',
    benefits: [
      'Multiple location rights',
      'Advanced training programs',
      'Regional marketing support',
      'Business development tools',
    ],
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'corporate',
    name: 'Corporate Franchise',
    description: 'Lead the market with full control',
    investment: '$1,000,000+',
    benefits: [
      'Exclusive territory rights',
      'Priority support and training',
      'Custom marketing strategies',
      'Advanced business analytics',
    ],
    color: 'from-indigo-500 to-indigo-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function FranchiseHighlight() {
  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Own a Verified EHB Franchise</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our global network of successful franchise owners and build your future with EHB
            Technologies.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {franchiseTypes.map(type => (
            <motion.div key={type.id} variants={cardVariants}>
              <div
                className={`bg-gradient-to-r ${type.color} rounded-xl shadow-lg overflow-hidden h-full`}
              >
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{type.name}</h3>
                  <p className="text-blue-100 mb-4">{type.description}</p>
                  <div className="text-xl font-semibold mb-6">{type.investment}</div>
                  <ul className="space-y-3 mb-6">
                    {type.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/ehb-franchise?type=${type.id}`}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Learn More
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
