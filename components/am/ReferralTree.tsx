import React, { useState } from 'react';
import { FiUser, FiTrendingUp, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface TreeNode {
  id: string;
  name: string;
  sqlLevel: number;
  walletBalance: number;
  leftChild?: TreeNode;
  rightChild?: TreeNode;
  healthScore: number;
  lastActive: string;
}

// Mock data - replace with API calls
const mockTree: TreeNode = {
  id: '1',
  name: 'You',
  sqlLevel: 3,
  walletBalance: 1500,
  healthScore: 85,
  lastActive: '2024-02-20',
  leftChild: {
    id: '2',
    name: 'John Doe',
    sqlLevel: 2,
    walletBalance: 800,
    healthScore: 75,
    lastActive: '2024-02-19',
    leftChild: {
      id: '4',
      name: 'Alice Smith',
      sqlLevel: 1,
      walletBalance: 300,
      healthScore: 60,
      lastActive: '2024-02-18',
    },
    rightChild: {
      id: '5',
      name: 'Bob Johnson',
      sqlLevel: 2,
      walletBalance: 500,
      healthScore: 90,
      lastActive: '2024-02-20',
    },
  },
  rightChild: {
    id: '3',
    name: 'Jane Smith',
    sqlLevel: 3,
    walletBalance: 1200,
    healthScore: 95,
    lastActive: '2024-02-20',
    leftChild: {
      id: '6',
      name: 'Charlie Brown',
      sqlLevel: 1,
      walletBalance: 200,
      healthScore: 45,
      lastActive: '2024-02-15',
    },
    rightChild: {
      id: '7',
      name: 'Diana Prince',
      sqlLevel: 2,
      walletBalance: 600,
      healthScore: 80,
      lastActive: '2024-02-19',
    },
  },
};

const getHealthColor = (score: number) => {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  return 'text-red-500';
};

const TreeNode: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative">
      <div
        className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
          level === 0 ? 'bg-blue-50' : ''
        }`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <FiUser className={`w-5 h-5 ${getHealthColor(node.healthScore)}`} />
        <div>
          <p className="text-sm font-medium text-gray-900">{node.name}</p>
          <p className="text-xs text-gray-500">SQL {node.sqlLevel}</p>
        </div>
        <FiTrendingUp className={`w-4 h-4 ${getHealthColor(node.healthScore)}`} />
      </div>

      {showDetails && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="space-y-1">
            <p className="text-gray-600">Wallet: ${node.walletBalance}</p>
            <p className="text-gray-600">Health Score: {node.healthScore}%</p>
            <p className="text-gray-600">Last Active: {node.lastActive}</p>
          </div>
        </div>
      )}

      {(node.leftChild || node.rightChild) && (
        <div className="mt-4 flex space-x-4">
          {node.leftChild && (
            <div className="flex-1">
              <div className="h-4 border-l-2 border-b-2 border-gray-300" />
              <TreeNode node={node.leftChild} level={level + 1} />
            </div>
          )}
          {node.rightChild && (
            <div className="flex-1">
              <div className="h-4 border-l-2 border-b-2 border-gray-300" />
              <TreeNode node={node.rightChild} level={level + 1} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ReferralTree() {
  const [tree] = useState<TreeNode>(mockTree);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Referral Tree</h2>
        <div className="flex items-center space-x-2">
          <FiInfo className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">AI Health Score</span>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <TreeNode node={tree} level={0} />
        </div>
      </div>

      {/* Health Score Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Health Score Indicators</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">90-100%: Excellent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-600">70-89%: Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">Below 70%: Needs Attention</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">AI Recommendations</h3>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <FiAlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <p className="text-sm text-gray-600">
              Charlie Brown (SQL 1) has been inactive for 5 days. Consider reaching out.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <FiAlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <p className="text-sm text-gray-600">
              Left leg is weaker than right. Focus on recruiting in the left leg.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
