import React from 'react';
import {
  FiHelpCircle,
  FiBook,
  FiMessageSquare,
  FiVideo,
  FiFileText,
  FiSearch,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  link: string;
}

interface HelpCenterProps {
  articles: HelpArticle[];
  onSearch: (query: string) => void;
}

export default function HelpCenter({ articles, onSearch }: HelpCenterProps) {
  const categories = Array.from(new Set(articles.map(article => article.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Help Center</h2>
        <a href="/support" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Contact Support
        </a>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for help..."
          onChange={e => onSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
            <div className="space-y-4">
              {articles
                .filter(article => article.category === category)
                .map(article => (
                  <a
                    key={article.id}
                    href={article.link}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <article.icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{article.description}</p>
                    </div>
                  </a>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.a
          href="/support/contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <FiMessageSquare className="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Contact Support</h3>
            <p className="text-sm text-gray-500 mt-1">Get help from our support team</p>
          </div>
        </motion.a>

        <motion.a
          href="/support/videos"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <FiVideo className="w-6 h-6 text-green-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Video Tutorials</h3>
            <p className="text-sm text-gray-500 mt-1">Watch helpful video guides</p>
          </div>
        </motion.a>

        <motion.a
          href="/support/docs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <FiFileText className="w-6 h-6 text-purple-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Documentation</h3>
            <p className="text-sm text-gray-500 mt-1">Read detailed documentation</p>
          </div>
        </motion.a>
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FiHelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-gray-500">No help articles available</p>
        </div>
      )}
    </div>
  );
}
