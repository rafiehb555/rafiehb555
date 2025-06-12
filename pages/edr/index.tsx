import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiBook, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import ExamDashboard from '@/components/EDR/ExamDashboard';
import ExamRegistration from '@/components/EDR/ExamRegistration';
import ExamSubmission from '@/components/EDR/ExamSubmission';
import ResultView from '@/components/EDR/ResultView';
import RetakeNotice from '@/components/EDR/RetakeNotice';

type EDRView = 'dashboard' | 'register' | 'submit' | 'result' | 'retake';

export default function EDRPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeView, setActiveView] = useState<EDRView>('dashboard');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <ExamDashboard onViewChange={setActiveView} />;
      case 'register':
        return <ExamRegistration onViewChange={setActiveView} />;
      case 'submit':
        return <ExamSubmission onViewChange={setActiveView} />;
      case 'result':
        return <ResultView onViewChange={setActiveView} />;
      case 'retake':
        return <RetakeNotice onViewChange={setActiveView} />;
      default:
        return <ExamDashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  EDR - Exam Decision Registration
                </h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeView === 'dashboard'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiBook className="mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('register')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeView === 'register'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiFileText className="mr-2" />
                Register Exam
              </button>
              <button
                onClick={() => setActiveView('submit')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeView === 'submit'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiCheckCircle className="mr-2" />
                Submit Exam
              </button>
              <button
                onClick={() => setActiveView('result')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeView === 'result'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiAlertCircle className="mr-2" />
                Results
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{renderView()}</main>
    </div>
  );
}
