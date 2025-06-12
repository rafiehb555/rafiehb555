import { useState, useEffect } from 'react';
import { FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface RetakeNoticeProps {
  onViewChange: (view: string) => void;
}

interface RetakeInfo {
  examId: string;
  examTitle: string;
  lastAttemptDate: string;
  nextEligibleDate: string;
  attemptsRemaining: number;
  isEligible: boolean;
  daysUntilEligible: number;
}

export default function RetakeNotice({ onViewChange }: RetakeNoticeProps) {
  const [retakeInfo, setRetakeInfo] = useState<RetakeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchRetakeInfo = async () => {
      try {
        // Mock retake info
        const mockRetakeInfo: RetakeInfo = {
          examId: '1',
          examTitle: 'Medical Practitioner Certification',
          lastAttemptDate: '2024-01-15T10:30:00Z',
          nextEligibleDate: '2024-07-15T10:30:00Z',
          attemptsRemaining: 2,
          isEligible: false,
          daysUntilEligible: 45,
        };

        setRetakeInfo(mockRetakeInfo);
        setLoading(false);
      } catch (err) {
        setError('Failed to load retake information. Please try again.');
        console.error('Error loading retake info:', err);
        setLoading(false);
      }
    };

    fetchRetakeInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!retakeInfo) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No retake information found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Unable to load retake information for this exam.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Retake Information</h3>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                retakeInfo.isEligible
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {retakeInfo.isEligible ? (
                <FiCheckCircle className="mr-1.5 h-5 w-5" />
              ) : (
                <FiClock className="mr-1.5 h-5 w-5" />
              )}
              {retakeInfo.isEligible ? 'Eligible for Retake' : 'Not Yet Eligible'}
            </span>
          </div>

          <div className="mt-4">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Last Attempt</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {new Date(retakeInfo.lastAttemptDate).toLocaleDateString()}
                </dd>
              </div>

              <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Next Eligible Date</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {new Date(retakeInfo.nextEligibleDate).toLocaleDateString()}
                </dd>
              </div>

              <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Attempts Remaining</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {retakeInfo.attemptsRemaining}
                </dd>
              </div>

              <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Days Until Eligible</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {retakeInfo.daysUntilEligible}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      You must wait at least 6 months between exam attempts. This policy ensures
                      that candidates have adequate time to prepare and improve their skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => onViewChange('dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </button>
            {retakeInfo.isEligible && (
              <button
                onClick={() => onViewChange('register')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register for Retake
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
