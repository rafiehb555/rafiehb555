'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Enrollment } from '@/lib/models/Enrollment';
import { Course } from '@/lib/models/Course';
import { Wallet } from '@/lib/models/Wallet';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal';
import { FaGraduationCap, FaCoins, FaMedal } from 'react-icons/fa';
import { calculateLoyaltyDiscount } from '@/lib/utils/franchiseUtils';

type EnrollmentWithDetails = Enrollment & {
  course: Course & {
    tutor: {
      name: string;
      email: string;
      sqlLevel: number;
    };
  };
};

type StudentStats = {
  totalCourses: number;
  completedCourses: number;
  activeCourses: number;
  totalSavings: number;
  badges: {
    name: string;
    description: string;
    icon: string;
  }[];
};

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [stats, setStats] = useState<StudentStats>({
    totalCourses: 0,
    completedCourses: 0,
    activeCourses: 0,
    totalSavings: 0,
    badges: [],
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchStudentData();
    }
  }, [session?.user?.id]);

  const fetchStudentData = async () => {
    try {
      // Fetch enrollments
      const enrollmentsResponse = await fetch('/api/enrollments');
      if (!enrollmentsResponse.ok) throw new Error('Failed to fetch enrollments');
      const enrollmentsData = await enrollmentsResponse.json();
      setEnrollments(enrollmentsData.enrollments);

      // Fetch wallet
      const walletResponse = await fetch('/api/wallet');
      if (!walletResponse.ok) throw new Error('Failed to fetch wallet');
      const walletData = await walletResponse.json();
      setWallet(walletData.wallet);

      // Calculate stats
      calculateStats(enrollmentsData.enrollments);
    } catch (err) {
      setError('Failed to load student data');
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (enrollments: EnrollmentWithDetails[]) => {
    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const activeCourses = enrollments.filter(e => e.status === 'active').length;
    const totalSavings = enrollments.reduce((sum, e) => {
      const course = e.course;
      const discount = calculateLoyaltyDiscount(wallet?.coinLock || 0);
      return sum + (course.price * discount) / 100;
    }, 0);

    // Calculate badges
    const badges = [];
    if (completedCourses >= 5) {
      badges.push({
        name: 'Dedicated Learner',
        description: 'Completed 5 or more courses',
        icon: '🎓',
      });
    }
    if (totalSavings >= 1000) {
      badges.push({
        name: 'Smart Saver',
        description: 'Saved 1000+ coins through loyalty',
        icon: '💰',
      });
    }
    if (enrollments.some(e => e.course.subject === 'computer-science')) {
      badges.push({
        name: 'Tech Enthusiast',
        description: 'Completed a computer science course',
        icon: '💻',
      });
    }

    setStats({
      totalCourses: enrollments.length,
      completedCourses,
      activeCourses,
      totalSavings,
      badges,
    });
  };

  const handleCancelEnrollment = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel enrollment');

      toast.success('Enrollment cancelled successfully');
      fetchStudentData();
    } catch (err) {
      toast.error('Failed to cancel enrollment');
      console.error('Error cancelling enrollment:', err);
    }
  };

  const handleRateCourse = async () => {
    if (!selectedEnrollment) return;

    try {
      const response = await fetch(`/api/enrollments/${selectedEnrollment._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) throw new Error('Failed to rate course');

      toast.success('Course rated successfully');
      setShowRatingModal(false);
      setRating(0);
      fetchStudentData();
    } catch (err) {
      toast.error('Failed to rate course');
      console.error('Error rating course:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Courses</h1>
          <p className="text-xl text-gray-600">
            Manage your enrolled courses and track your progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Courses</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalCourses}</p>
              </div>
              <FaGraduationCap className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Active Courses</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeCourses}</p>
              </div>
              <FaMedal className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.completedCourses}</p>
              </div>
              <FaGraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Savings</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.totalSavings.toFixed(2)} coins
                </p>
              </div>
              <FaCoins className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Badges */}
        {stats.badges.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredEnrollments.map(enrollment => (
              <motion.div
                key={enrollment._id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{enrollment.course.title}</h3>
                    <p className="text-gray-600 mt-1">{enrollment.course.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{enrollment.course.subject}</span>
                      <span className="text-sm text-gray-500">{enrollment.course.city}</span>
                      <span className="text-sm text-gray-500">{enrollment.course.mode}</span>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          enrollment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : enrollment.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Tutor: {enrollment.course.tutor.name} (SQL Level{' '}
                        {enrollment.course.tutor.sqlLevel})
                      </p>
                      <p className="text-sm text-gray-600">
                        Schedule: {enrollment.course.schedule.days.join(', ')} at{' '}
                        {enrollment.course.schedule.times.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {enrollment.status === 'completed' && !enrollment.rating && (
                      <button
                        onClick={() => {
                          setSelectedEnrollment(enrollment);
                          setShowRatingModal(true);
                        }}
                        className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Rate Course
                      </button>
                    )}
                    {enrollment.status === 'active' && (
                      <button
                        onClick={() => handleCancelEnrollment(enrollment._id.toString())}
                        className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredEnrollments.length === 0 && (
              <div className="p-6 text-center text-gray-500">No courses found</div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedEnrollment && (
        <Modal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          title="Rate Course"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <div className="mt-2 flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`p-2 rounded-full ${
                      rating >= value ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowRatingModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRateCourse}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Rating
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
