import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiDownload } from 'react-icons/fi';

interface ResultViewProps {
  onViewChange: (view: string) => void;
}

interface ExamResult {
  id: string;
  examTitle: string;
  category: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  submissionDate: string;
  feedback: string;
  sqlLevel: number;
  questions: {
    id: string;
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export default function ResultView({ onViewChange }: ResultViewProps) {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchResult = async () => {
      try {
        // Mock result data
        const mockResult: ExamResult = {
          id: '1',
          examTitle: 'Medical Practitioner Certification',
          category: 'Healthcare',
          score: 85,
          totalMarks: 100,
          passed: true,
          submissionDate: '2024-02-20T14:30:00Z',
          feedback:
            'Excellent performance! You have demonstrated strong knowledge in medical practices.',
          sqlLevel: 3,
          questions: [
            {
              id: '1',
              question: 'What is the primary function of the heart?',
              correctAnswer: 'Pumping blood throughout the body',
              userAnswer: 'Pumping blood throughout the body',
              isCorrect: true,
            },
            {
              id: '2',
              question: 'Explain the process of blood circulation in the human body.',
              correctAnswer:
                'The heart pumps oxygenated blood through arteries to the body, and deoxygenated blood returns through veins.',
              userAnswer:
                'Blood is pumped by the heart through arteries and returns through veins.',
              isCorrect: true,
            },
            {
              id: '3',
              question: 'Identify the medical condition shown in the image.',
              correctAnswer: 'Hypertension',
              userAnswer: 'High blood pressure',
              isCorrect: true,
            },
          ],
        };

        setResult(mockResult);
        setLoading(false);
      } catch (err) {
        setError('Failed to load exam results. Please try again.');
        console.error('Error loading results:', err);
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const handleDownloadCertificate = () => {
    // TODO: Implement certificate download
    console.log('Downloading certificate...');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The exam results you're looking for don't exist or you don't have access to them.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Result Header */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{result.examTitle}</h3>
              <p className="mt-1 text-sm text-gray-500">Category: {result.category}</p>
            </div>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {result.passed ? (
                  <FiCheckCircle className="mr-1.5 h-5 w-5" />
                ) : (
                  <FiXCircle className="mr-1.5 h-5 w-5" />
                )}
                {result.passed ? 'Passed' : 'Failed'}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Score</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {result.score}/{result.totalMarks}
                </dd>
              </div>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">SQL Level</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{result.sqlLevel}</dd>
              </div>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Submission Date</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {new Date(result.submissionDate).toLocaleDateString()}
                </dd>
              </div>
            </div>
          </div>

          {result.passed && (
            <div className="mt-6">
              <button
                onClick={handleDownloadCertificate}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiDownload className="mr-2 h-5 w-5" />
                Download Certificate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-base font-medium text-gray-900">Feedback</h4>
          <p className="mt-2 text-sm text-gray-500">{result.feedback}</p>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">Question Review</h4>
          <div className="space-y-6">
            {result.questions.map((question, index) => (
              <div
                key={question.id}
                className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {question.isCorrect ? (
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <FiXCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Question {index + 1}: {question.question}
                    </p>
                    <div className="mt-2 space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Your Answer:</p>
                        <p className="text-sm text-gray-900">{question.userAnswer}</p>
                      </div>
                      {!question.isCorrect && (
                        <div>
                          <p className="text-sm text-gray-500">Correct Answer:</p>
                          <p className="text-sm text-gray-900">{question.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onViewChange('dashboard')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
