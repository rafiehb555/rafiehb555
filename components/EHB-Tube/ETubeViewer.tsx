import React, { useState, useEffect } from 'react';
import { FiEye, FiThumbsUp, FiTag, FiUser, FiAward } from 'react-icons/fi';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  tags: string[];
  creator: {
    id: string;
    name: string;
    sqlLevel: string;
    avatarUrl: string;
  };
}

export default function ETubeViewer() {
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implement API call to fetch video
    const fetchVideo = async () => {
      try {
        const response = await fetch('/api/ehb-tube/list-videos');
        const data = await response.json();
        setVideo(data[0]); // For demo, show first video
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
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

  if (error || !video) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'No video available'}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Player</h2>

      {/* Video Player */}
      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
        <video src={video.url} poster={video.thumbnailUrl} controls className="w-full h-full" />
      </div>

      {/* Video Info */}
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{video.title}</h3>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FiEye className="h-4 w-4 mr-1" />
              <span>{video.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center">
              <FiThumbsUp className="h-4 w-4 mr-1" />
              <span>{video.likes.toLocaleString()} likes</span>
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center space-x-3">
          <img
            src={video.creator.avatarUrl}
            alt={video.creator.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{video.creator.name}</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSqlLevelColor(video.creator.sqlLevel)}`}
              >
                <FiAward className="h-3 w-3 mr-1" />
                {video.creator.sqlLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-600">
          <p>{video.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {video.tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                tag === selectedTag
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <FiTag className="h-3 w-3 mr-1" />
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
