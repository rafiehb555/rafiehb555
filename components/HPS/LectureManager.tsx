import React, { useState } from 'react';
import { FiUpload, FiVideo, FiMic, FiMessageSquare } from 'react-icons/fi';

interface Lecture {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'ai';
  url: string;
  date: string;
  duration: string;
}

// Mock data - replace with API calls
const mockLectures: Lecture[] = [
  {
    id: '1',
    title: 'Introduction to AI',
    type: 'video',
    url: 'https://example.com/lecture1',
    date: '2024-03-15T10:00:00Z',
    duration: '45:00',
  },
  {
    id: '2',
    title: 'Machine Learning Basics',
    type: 'ai',
    url: 'https://example.com/lecture2',
    date: '2024-03-16T10:00:00Z',
    duration: '45:00',
  },
];

export default function LectureManager() {
  const [lectures] = useState<Lecture[]>(mockLectures);
  const [isUploading, setIsUploading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleUpload = async (type: 'video' | 'audio') => {
    setIsUploading(true);
    try {
      // TODO: Implement file upload logic
      console.log(`Uploading ${type} lecture...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsUploading(true);
    try {
      // TODO: Implement AI lecture generation
      console.log('Generating AI lecture with prompt:', aiPrompt);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiPrompt('');
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Lecture Manager</h2>

      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleUpload('video')}
          disabled={isUploading}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <FiVideo className="w-5 h-5" />
          <span>Upload Video</span>
        </button>
        <button
          onClick={() => handleUpload('audio')}
          disabled={isUploading}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <FiMic className="w-5 h-5" />
          <span>Upload Audio</span>
        </button>
        <button
          onClick={handleAIGenerate}
          disabled={isUploading || !aiPrompt.trim()}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <FiMessageSquare className="w-5 h-5" />
          <span>Generate AI Lecture</span>
        </button>
      </div>

      {/* AI Prompt Input */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700 mb-2">
          AI Lecture Prompt
        </label>
        <textarea
          id="aiPrompt"
          value={aiPrompt}
          onChange={e => setAiPrompt(e.target.value)}
          placeholder="Enter a prompt for AI lecture generation..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
        />
      </div>

      {/* Recent Lectures */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Lectures</h3>
        <div className="space-y-4">
          {lectures.map(lecture => (
            <div
              key={lecture.id}
              className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                {lecture.type === 'video' ? (
                  <FiVideo className="w-5 h-5 text-blue-500" />
                ) : lecture.type === 'audio' ? (
                  <FiMic className="w-5 h-5 text-green-500" />
                ) : (
                  <FiMessageSquare className="w-5 h-5 text-purple-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{lecture.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(lecture.date).toLocaleString()} • {lecture.duration}
                  </p>
                </div>
              </div>
              <a
                href={lecture.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                View
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
