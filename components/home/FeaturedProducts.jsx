'use client';
import { motion } from 'framer-motion';

const products = [
  {
    id: 1,
    title: 'Online Course Bundle',
    description: 'Access to premium educational content',
    price: '$99',
    category: 'Education',
    image: '📚',
  },
  {
    id: 2,
    title: 'Health Checkup Package',
    description: 'Comprehensive health assessment',
    price: '$149',
    category: 'Health',
    image: '🏥',
  },
  {
    id: 3,
    title: 'Business Starter Kit',
    description: 'Everything to start your business',
    price: '$299',
    category: 'Business',
    image: '💼',
  },
  {
    id: 4,
    title: 'Legal Consultation',
    description: 'Expert legal advice',
    price: '$199',
    category: 'Legal',
    image: '⚖️',
  },
];

export default function FeaturedProducts() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="text-4xl mb-4">{product.image}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
