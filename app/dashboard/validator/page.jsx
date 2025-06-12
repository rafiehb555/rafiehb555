'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ethers } from 'ethers';

export default function ValidatorDashboard() {
  const [validatorData, setValidatorData] = useState(null);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchValidatorData();
    fetchRewardHistory();
  }, []);

  const fetchValidatorData = async () => {
    try {
      const response = await fetch('/api/validator/status');
      const data = await response.json();
      setValidatorData(data);
    } catch (error) {
      console.error('Error fetching validator data:', error);
    }
  };

  const fetchRewardHistory = async () => {
    try {
      const response = await fetch('/api/rewards/history');
      const data = await response.json();
      setRewardHistory(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reward history:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Validator Dashboard</h1>
      
      {/* Validator Status Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Validator Status</h2>
        {validatorData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-gray-600">Total Locked Coins</p>
              <p className="text-2xl font-bold">
                {ethers.utils.formatEther(validatorData.stakedAmount)} EHBGC
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-gray-600">Loyalty Bonus</p>
              <p className="text-2xl font-bold">
                {validatorData.loyaltyBonus}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-gray-600">Current Reward</p>
              <p className="text-2xl font-bold">
                {ethers.utils.formatEther(validatorData.currentReward)} EHBGC
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reward History Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Reward History</h2>
        <div className="h-[400px]">
          <LineChart
            width={800}
            height={400}
            data={rewardHistory}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="reward"
              stroke="#8884d8"
              name="Reward (EHBGC)"
            />
          </LineChart>
        </div>
      </div>

      {/* Validator Info */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Validator Information</h2>
        {validatorData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">SQL Level</p>
              <p className="font-semibold">{validatorData.sqlLevel}</p>
            </div>
            <div>
              <p className="text-gray-600">Franchise Role</p>
              <p className="font-semibold">{validatorData.franchiseRole}</p>
            </div>
            <div>
              <p className="text-gray-600">Staking Start Date</p>
              <p className="font-semibold">
                {new Date(validatorData.stakingStartTime * 1000).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Validator Status</p>
              <p className="font-semibold">
                <span className={`px-2 py-1 rounded ${
                  validatorData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {validatorData.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 