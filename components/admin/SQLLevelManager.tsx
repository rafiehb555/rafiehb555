import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  currentLevel: number;
  requestedLevel?: number;
  status: 'verified' | 'pending' | 'rejected';
  type: 'tutor' | 'doctor' | 'shop' | 'franchise';
}

interface SQLLevelManagerProps {
  users: User[];
  onLevelChange: (userId: string, newLevel: number) => Promise<void>;
}

export default function SQLLevelManager({ users, onLevelChange }: SQLLevelManagerProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLevelChange = async (userId: string, newLevel: number) => {
    try {
      setIsLoading(true);
      await onLevelChange(userId, newLevel);
      toast.success('SQL level updated successfully');
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to update SQL level');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
    }
  };

  const getTypeIcon = (type: User['type']) => {
    switch (type) {
      case 'tutor':
        return '👨‍🏫';
      case 'doctor':
        return '👨‍⚕️';
      case 'shop':
        return '🏪';
      case 'franchise':
        return '🏢';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">SQL Level Management</h2>

      <div className="space-y-4">
        {users.map(user => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FaUser className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm">{getTypeIcon(user.type)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Level</p>
                <p className="font-semibold text-gray-900">SQL-{user.currentLevel}</p>
                {user.requestedLevel && (
                  <p className="text-sm text-blue-600">Requested: SQL-{user.requestedLevel}</p>
                )}
              </div>

              <div className="flex space-x-2">
                {user.requestedLevel && (
                  <>
                    <button
                      onClick={() => handleLevelChange(user.id, user.requestedLevel!)}
                      disabled={isLoading}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    >
                      <FaCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleLevelChange(user.id, user.currentLevel)}
                      disabled={isLoading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </>
                )}
                {!user.requestedLevel && (
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <FaExclamationTriangle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Level Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Change SQL Level for {selectedUser.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New SQL Level</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={selectedUser.currentLevel}
                >
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <option key={level} value={level}>
                      SQL-{level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLevelChange(selectedUser.id, selectedUser.currentLevel)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {isLoading ? 'Updating...' : 'Update Level'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
