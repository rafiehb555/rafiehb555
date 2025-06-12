import React from 'react';
import ETubeUpload from '../../components/EHB-Tube/ETubeUpload';
import ETubeViewer from '../../components/EHB-Tube/ETubeViewer';
import ETubeCreatorProfile from '../../components/EHB-Tube/ETubeCreatorProfile';
import ETubeModerationLog from '../../components/EHB-Tube/ETubeModerationLog';
import { FiUpload, FiPlay, FiUser, FiShield } from 'react-icons/fi';

export default function ETubePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">EHB Tube</h1>
          <p className="mt-1 text-sm text-gray-500">
            Share your knowledge and earn through verified video content
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700"
              aria-current="page"
            >
              <FiPlay className="mr-2 h-5 w-5" />
              Browse Videos
            </button>
            <button className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              <FiUpload className="mr-2 h-5 w-5" />
              Upload Video
            </button>
            <button className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              <FiUser className="mr-2 h-5 w-5" />
              Creator Profile
            </button>
            <button className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              <FiShield className="mr-2 h-5 w-5" />
              Moderation
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Video Viewer Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Featured Videos</h2>
            <ETubeViewer />
          </section>

          {/* Upload Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Video</h2>
            <ETubeUpload />
          </section>

          {/* Creator Profile Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Creator Profile</h2>
            <ETubeCreatorProfile />
          </section>

          {/* Moderation Section - Only visible to admins */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Content Moderation</h2>
            <ETubeModerationLog />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} EHB Tube. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
