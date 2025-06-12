import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiBook, FiUpload, FiClock, FiBookOpen } from 'react-icons/fi';
import BookList from '../../components/OBS/BookList';
import BookUpload from '../../components/OBS/BookUpload';
import ReadingHistory from '../../components/OBS/ReadingHistory';
import CourseLibrary from '../../components/OBS/CourseLibrary';

type OBSView = 'books' | 'upload' | 'history' | 'courses';

export default function OBSPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeView, setActiveView] = useState<OBSView>('books');

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const views = [
    { id: 'books', label: 'Book Library', icon: FiBook },
    { id: 'upload', label: 'Upload Books', icon: FiUpload },
    { id: 'history', label: 'Reading History', icon: FiClock },
    { id: 'courses', label: 'Course Library', icon: FiBookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Online Book Store</h1>
          <p className="mt-2 text-sm text-gray-600">
            Access educational resources, track your reading progress, and manage course materials
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {views.map(view => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id as OBSView)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeView === view.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {view.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow rounded-lg">
          {activeView === 'books' && <BookList />}
          {activeView === 'upload' && <BookUpload />}
          {activeView === 'history' && <ReadingHistory />}
          {activeView === 'courses' && <CourseLibrary />}
        </div>
      </div>
    </div>
  );
}
