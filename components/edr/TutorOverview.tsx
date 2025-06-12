import { FaGraduationCap, FaCoins, FaUsers, FaStar, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Tutor } from '@/lib/models/Tutor';
import { Wallet } from '@/lib/models/Wallet';

interface TutorOverviewProps {
  tutor: Tutor;
  wallet: Wallet;
  stats: {
    totalStudents: number;
    activeStudents: number;
    totalEarnings: number;
    averageRating: number;
  };
}

export default function TutorOverview({ tutor, wallet, stats }: TutorOverviewProps) {
  const isVerified = tutor.sqlLevel >= 3;
  const progressToVerification = (tutor.sqlLevel / 3) * 100;

  return (
    <div className="space-y-6">
      {/* SQL Level Badge */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">SQL Level</h3>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">{tutor.sqlLevel}</span>
              {isVerified ? (
                <span className="px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                  Verified
                </span>
              ) : (
                <span className="px-2 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
                  Pending
                </span>
              )}
            </div>
            {!isVerified && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progressToVerification}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {300 - tutor.sqlLevel * 100} more EHBGC needed for verification
                </p>
              </div>
            )}
          </div>
          <FaLock className={`w-8 h-8 ${isVerified ? 'text-green-500' : 'text-yellow-500'}`} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
            </div>
            <FaUsers className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Active Students</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeStudents}</p>
            </div>
            <FaGraduationCap className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.totalEarnings.toFixed(2)} coins
              </p>
            </div>
            <FaCoins className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.averageRating.toFixed(1)}/5
              </p>
            </div>
            <FaStar className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      {/* Wallet Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Wallet Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900">{wallet.balance} coins</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Locked Coins</p>
            <p className="text-2xl font-bold text-gray-900">{wallet.coinLock} coins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
