import React, { useState, useEffect } from 'react';
import { FiFlag, FiClock, FiCheck, FiX } from 'react-icons/fi';

interface Report {
  id: string;
  videoId: string;
  videoTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolution?: string;
}

export default function ETubeModerationLog() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // TODO: Implement API call to fetch reports
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/ehb-tube/reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Failed to load moderation log');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleStatusChange = async (
    reportId: string,
    newStatus: Report['status'],
    resolution?: string
  ) => {
    try {
      const response = await fetch(`/api/ehb-tube/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, resolution }),
      });

      if (!response.ok) {
        throw new Error('Failed to update report status');
      }

      setReports(prev =>
        prev.map(report =>
          report.id === reportId ? { ...report, status: newStatus, resolution } : report
        )
      );
    } catch (error) {
      console.error('Error updating report:', error);
      setError('Failed to update report status');
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(
    report => selectedStatus === 'all' || report.status === selectedStatus
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Moderation Log</h2>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        >
          <option value="all">All Reports</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <FiFlag className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-medium text-gray-900">{report.videoTitle}</h3>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Reported by: {report.reporterName}</p>
                  <p>Reason: {report.reason}</p>
                  <div className="mt-1 flex items-center">
                    <FiClock className="h-4 w-4 mr-1" />
                    <span>{new Date(report.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                {report.resolution && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Resolution: {report.resolution}</p>
                  </div>
                )}
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
                {report.status === 'pending' && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(report.id, 'resolved', 'Content reviewed and approved')
                      }
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FiCheck className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(report.id, 'dismissed', 'Report dismissed as invalid')
                      }
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FiFlag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedStatus === 'all'
              ? 'There are no reports in the system.'
              : `There are no ${selectedStatus} reports.`}
          </p>
        </div>
      )}
    </div>
  );
}
