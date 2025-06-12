import React from 'react';
import DevelopmentTracker from '@/components/EHB-Dashboard/DevelopmentTracker';

export default function DevelopmentPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Development Center</h1>
        <p className="text-gray-600 mt-2">
          Track and manage the development progress of all EHB modules.
        </p>
      </div>

      <DevelopmentTracker />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Development Guidelines</h2>
        <div className="prose max-w-none">
          <h3>Code Standards</h3>
          <ul>
            <li>Follow TypeScript best practices and type safety</li>
            <li>Use TailwindCSS for styling</li>
            <li>Implement responsive design for all components</li>
            <li>Write clean, documented code with proper comments</li>
          </ul>

          <h3>Testing Requirements</h3>
          <ul>
            <li>Write unit tests for all components</li>
            <li>Implement integration tests for critical flows</li>
            <li>Perform cross-browser testing</li>
            <li>Test responsive design on multiple devices</li>
          </ul>

          <h3>Documentation</h3>
          <ul>
            <li>Maintain up-to-date README files</li>
            <li>Document all API endpoints</li>
            <li>Keep component documentation current</li>
            <li>Update roadmap and progress regularly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
