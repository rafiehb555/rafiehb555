import { useState, useEffect } from 'react';
import { FiBook, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface Exam {
  id: string;
  title: string;
  category: string;
  status: 'available' | 'registered' | 'completed';
  registrationDeadline: string;
  examDate: string;
  sqlLevel: number;
}

interface ExamDashboardProps {
  onViewChange: (view: string) => void;
}

export default function ExamDashboard({ onViewChange }: ExamDashboardProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchExams = async () => {
      try {
        // Mock data for now
        const mockExams: Exam[] = [
          {
            id: '1',
            title: 'Medical Practitioner Certification',
            category: 'Healthcare',
            status: 'available',
            registrationDeadline: '2024-03-15',
            examDate: '2024-03-20',
            sqlLevel: 3,
          },
          {
            id: '2',
            title: 'Advanced Tutoring Skills',
            category: 'Education',
            status: 'registered',
            registrationDeadline: '2024-03-10',
            examDate: '2024-03-15',
            sqlLevel: 2,
          },
          {
            id: '3',
            title: 'Automotive Repair Certification',
            category: 'Automotive',
            status: 'completed',
            registrationDeadline: '2024-02-15',
            examDate: '2024-02-20',
            sqlLevel: 4,
          },
        ];
        setExams(mockExams);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exams:', error);
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Exams</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {exams.filter(exam => exam.status === 'available').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiClock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Registered Exams</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {exams.filter(exam => exam.status === 'registered').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Exams</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {exams.filter(exam => exam.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Deadlines</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {exams.filter(exam => new Date(exam.registrationDeadline) > new Date()).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exam List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {exams.map(exam => (
            <li key={exam.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">{exam.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        SQL {exam.sqlLevel}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {exam.category}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <FiClock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      Registration Deadline:{' '}
                      {new Date(exam.registrationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Exam Date: {new Date(exam.examDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  {exam.status === 'available' && (
                    <button
                      onClick={() => onViewChange('register')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Register Now
                    </button>
                  )}
                  {exam.status === 'registered' && (
                    <button
                      onClick={() => onViewChange('submit')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Take Exam
                    </button>
                  )}
                  {exam.status === 'completed' && (
                    <button
                      onClick={() => onViewChange('result')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      View Results
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
