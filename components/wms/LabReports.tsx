import React, { useState } from 'react';
import { FiUpload, FiFileText, FiDownload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface LabReport {
  id: string;
  title: string;
  type: 'blood' | 'imaging' | 'pathology' | 'other';
  date: string;
  lab: string;
  status: 'pending' | 'analyzed' | 'error';
  fileUrl: string;
  analysis?: {
    summary: string;
    recommendations: string[];
  };
}

// Mock data - replace with API calls
const mockReports: LabReport[] = [
  {
    id: '1',
    title: 'Complete Blood Count',
    type: 'blood',
    date: '2024-03-01',
    lab: 'Central Lab Services',
    status: 'analyzed',
    fileUrl: '/reports/cbc.pdf',
    analysis: {
      summary: 'All parameters within normal range',
      recommendations: [
        'Maintain current diet and exercise routine',
        'Schedule follow-up in 6 months',
      ],
    },
  },
  {
    id: '2',
    title: 'Chest X-Ray',
    type: 'imaging',
    date: '2024-02-15',
    lab: 'Radiology Center',
    status: 'pending',
    fileUrl: '/reports/xray.pdf',
  },
];

export default function LabReports() {
  const [reports] = useState<LabReport[]>(mockReports);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [uploading, setUploading] = useState(false);

  const filteredReports = reports.filter(report => {
    return selectedType === 'all' || report.type === selectedType;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // TODO: Implement file upload logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated upload
      console.log('File uploaded:', file.name);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'pending':
        return <FiAlertCircle className="w-4 h-4" />;
      case 'error':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Lab Reports</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="blood">Blood Tests</option>
            <option value="imaging">Imaging</option>
            <option value="pathology">Pathology</option>
            <option value="other">Other</option>
          </select>
          <label className="relative">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <FiUpload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Report'}</span>
            </div>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.map(report => (
          <div
            key={report.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <FiFileText className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                </div>
                <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                  <span className="capitalize">{report.type}</span>
                  <span>•</span>
                  <span>{report.lab}</span>
                  <span>•</span>
                  <span>{new Date(report.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {getStatusIcon(report.status)}
                  <span className="ml-1 capitalize">{report.status}</span>
                </span>
                <button
                  onClick={() => window.open(report.fileUrl, '_blank')}
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                >
                  <FiDownload className="w-5 h-5" />
                </button>
              </div>
            </div>

            {report.analysis && (
              <div className="mt-4 space-y-3">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                  <p className="text-blue-700">{report.analysis.summary}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {report.analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-600">
                        <FiCheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
