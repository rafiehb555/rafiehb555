import React from 'react';
import OBSBookUpload from '@/components/obs/OBSBookUpload';
import OBSCategoryLibrary from '@/components/obs/OBSCategoryLibrary';
import OBSStudyPool from '@/components/obs/OBSStudyPool';
import OBSExamCertificateTracker from '@/components/obs/OBSExamCertificateTracker';

export default function OBSPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Online Book Store</h1>
          <p className="mt-2 text-lg text-gray-600">
            Access books, study materials, and track your learning progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book Upload Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <OBSBookUpload />
          </div>

          {/* Category Library Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <OBSCategoryLibrary />
          </div>

          {/* Study Pool Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <OBSStudyPool />
          </div>

          {/* Certificate Tracker Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <OBSExamCertificateTracker />
          </div>
        </div>
      </div>
    </div>
  );
}
