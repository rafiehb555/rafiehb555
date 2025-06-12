import React, { useState, useEffect } from 'react';
import { FiAward, FiCalendar, FiFilter } from 'react-icons/fi';

interface Certificate {
  id: string;
  title: string;
  subject: string;
  date: string;
  score: number;
  status: 'passed' | 'failed' | 'in-progress';
  certificateUrl?: string;
}

export default function OBSExamCertificateTracker() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isLoading, setIsLoading] = useState(true);

  const subjects = [
    'all',
    'SQL Basics',
    'Advanced SQL',
    'Database Design',
    'Data Analysis',
    'Performance Tuning',
  ];

  useEffect(() => {
    // TODO: Implement API call to fetch certificates
    const fetchCertificates = async () => {
      try {
        // Simulated API call
        const response = await fetch('/api/obs/certificate-log');
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter(cert => {
    const matchesSubject = selectedSubject === 'all' || cert.subject === selectedSubject;
    const matchesDateRange =
      (!dateRange.start || new Date(cert.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(cert.date) <= new Date(dateRange.end));
    return matchesSubject && matchesDateRange;
  });

  const getStatusColor = (status: Certificate['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam & Certificate Tracker</h2>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCertificates.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <FiAward className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-medium text-gray-900">{cert.title}</h3>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FiCalendar className="h-4 w-4 mr-1" />
                    <span>{new Date(cert.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{cert.subject}</span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}
                    >
                      {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                    </span>
                    {cert.score && (
                      <span className="ml-2 text-sm text-gray-600">Score: {cert.score}%</span>
                    )}
                  </div>
                </div>
                {cert.certificateUrl && cert.status === 'passed' && (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <FiAward className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
