import React from 'react';
import { FiTrendingUp, FiUsers, FiStar, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface JPSMetrics {
  totalEarnings: number;
  activeClients: number;
  rating: number;
  completedJobs: number;
}

interface JPSJob {
  id: string;
  title: string;
  client: string;
  status: 'in-progress' | 'completed' | 'pending';
  amount: number;
  dueDate: string;
}

interface MyJPSStatusProps {
  name: string;
  specialization: string;
  joinDate: string;
  metrics: JPSMetrics;
  recentJobs: JPSJob[];
  onJobClick: (jobId: string) => void;
}

export default function MyJPSStatus({
  name,
  specialization,
  joinDate,
  metrics,
  recentJobs,
  onJobClick,
}: MyJPSStatusProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500 mt-1">{specialization} Professional</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(joinDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 rounded-lg p-2">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics.totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 rounded-lg p-2">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.activeClients.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-500 rounded-lg p-2">
              <FiStar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.rating.toFixed(1)}/5.0</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-500 rounded-lg p-2">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.completedJobs.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h3>
        <div className="space-y-3">
          {recentJobs.map(job => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => onJobClick(job.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`rounded-full p-2 ${
                    job.status === 'completed'
                      ? 'bg-green-100'
                      : job.status === 'in-progress'
                        ? 'bg-blue-100'
                        : 'bg-yellow-100'
                  }`}
                >
                  <FiAward
                    className={`w-4 h-4 ${
                      job.status === 'completed'
                        ? 'text-green-600'
                        : job.status === 'in-progress'
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500">Client: {job.client}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${job.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  Due: {new Date(job.dueDate).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
