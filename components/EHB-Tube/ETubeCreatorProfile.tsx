import React, { useState, useEffect } from 'react';
import { FiVideo, FiDollarSign, FiAward, FiStar, FiEye } from 'react-icons/fi';

interface CreatorStats {
  id: string;
  name: string;
  avatarUrl: string;
  sqlLevel: string;
  totalVideos: number;
  totalViews: number;
  totalEarnings: number;
  averageRating: number;
  videos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    views: number;
    earnings: number;
  }[];
}

export default function ETubeCreatorProfile() {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implement API call to fetch creator stats
    const fetchCreatorStats = async () => {
      try {
        const response = await fetch('/api/ehb-tube/profile');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching creator stats:', error);
        setError('Failed to load creator profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorStats();
  }, []);

  const getSqlLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'high':
        return 'bg-purple-100 text-purple-800';
      case 'vip':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'No creator profile available'}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Creator Profile</h2>

      {/* Creator Info */}
      <div className="flex items-center space-x-4 mb-6">
        <img src={stats.avatarUrl} alt={stats.name} className="h-16 w-16 rounded-full" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">{stats.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSqlLevelColor(stats.sqlLevel)}`}
            >
              <FiAward className="h-3 w-3 mr-1" />
              {stats.sqlLevel.toUpperCase()}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <FiStar className="h-3 w-3 mr-1" />
              {stats.averageRating.toFixed(1)} Rating
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <FiVideo className="h-5 w-5 text-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Videos</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalVideos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <FiEye className="h-5 w-5 text-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <FiDollarSign className="h-5 w-5 text-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-lg font-semibold text-gray-900">
                ${stats.totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <FiStar className="h-5 w-5 text-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Videos */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Videos</h4>
        <div className="space-y-3">
          {stats.videos.map(video => (
            <div
              key={video.id}
              className="flex items-center space-x-3 bg-white rounded-lg shadow-sm p-3"
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-16 w-28 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span>{video.views.toLocaleString()} views</span>
                  <span className="mx-2">•</span>
                  <span>${video.earnings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
