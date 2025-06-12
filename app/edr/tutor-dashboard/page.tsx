'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Course } from '@/lib/models/Course';
import { Enrollment } from '@/lib/models/Enrollment';
import { Wallet } from '@/lib/models/Wallet';
import { Tutor } from '@/lib/models/Tutor';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal';
import TutorOverview from '@/components/edr/TutorOverview';
import CourseEditor from '@/components/edr/CourseEditor';
import StudentTable from '@/components/edr/StudentTable';
import { FaPlus, FaTrash } from 'react-icons/fa';

type EnrollmentWithDetails = Enrollment & {
  student: {
    name: string;
    email: string;
    sqlLevel: number;
  };
};

export default function TutorDashboard() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTutorData();
    }
  }, [session?.user?.id]);

  const fetchTutorData = async () => {
    try {
      // Fetch tutor profile
      const tutorResponse = await fetch('/api/tutors');
      if (!tutorResponse.ok) throw new Error('Failed to fetch tutor profile');
      const tutorData = await tutorResponse.json();
      setTutor(tutorData.tutor);

      // Fetch tutor's courses
      const coursesResponse = await fetch('/api/courses');
      if (!coursesResponse.ok) throw new Error('Failed to fetch courses');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData.courses);

      // Fetch tutor's enrollments
      const enrollmentsResponse = await fetch('/api/enrollments/tutor');
      if (!enrollmentsResponse.ok) throw new Error('Failed to fetch enrollments');
      const enrollmentsData = await enrollmentsResponse.json();
      setEnrollments(enrollmentsData.enrollments);

      // Fetch tutor's wallet
      const walletResponse = await fetch('/api/wallet');
      if (!walletResponse.ok) throw new Error('Failed to fetch wallet');
      const walletData = await walletResponse.json();
      setWallet(walletData.wallet);
    } catch (err) {
      setError('Failed to load tutor data');
      console.error('Error fetching tutor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (data: any) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create course');

      toast.success('Course created successfully');
      setShowCreateModal(false);
      fetchTutorData();
    } catch (err) {
      toast.error('Failed to create course');
      console.error('Error creating course:', err);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete course');

      toast.success('Course deleted successfully');
      fetchTutorData();
    } catch (err) {
      toast.error('Failed to delete course');
      console.error('Error deleting course:', err);
    }
  };

  const handleMarkComplete = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}/complete`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to mark enrollment as complete');

      toast.success('Enrollment marked as complete');
      fetchTutorData();
    } catch (err) {
      toast.error('Failed to mark enrollment as complete');
      console.error('Error marking enrollment as complete:', err);
    }
  };

  const handleCancelEnrollment = async (enrollmentId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}/cancel`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to cancel enrollment');

      toast.success('Enrollment cancelled successfully');
      fetchTutorData();
    } catch (err) {
      toast.error('Failed to cancel enrollment');
      console.error('Error cancelling enrollment:', err);
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

  if (!tutor || !wallet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Tutor profile not found</div>
      </div>
    );
  }

  const stats = {
    totalStudents: enrollments.length,
    activeStudents: enrollments.filter(e => e.status === 'active').length,
    totalEarnings: enrollments.reduce((sum, e) => {
      const course = courses.find(c => c._id.toString() === e.courseId.toString());
      return sum + (course?.price || 0) * 0.7; // 70% of course price
    }, 0),
    averageRating: courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tutor Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your courses and track your earnings</p>
        </div>

        {/* Overview */}
        <TutorOverview tutor={tutor} wallet={wallet} stats={stats} />

        {/* Courses */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
                {tutor.sqlLevel >= 3 && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Create Course
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {courses.map(course => (
                <motion.div
                  key={course._id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                      <p className="text-gray-600 mt-1">{course.description}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{course.subject}</span>
                        <span className="text-sm text-gray-500">{course.city}</span>
                        <span className="text-sm text-gray-500">{course.mode}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {course.price} coins
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Schedule: {course.schedule.days.join(', ')} at{' '}
                          {course.schedule.times.join(', ')}
                        </p>
                      </div>
                    </div>
                    {tutor.sqlLevel >= 3 && (
                      <button
                        onClick={() => handleDeleteCourse(course._id.toString())}
                        className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                      >
                        <FaTrash className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {courses.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No courses found.{' '}
                  {tutor.sqlLevel >= 3
                    ? 'Create your first course!'
                    : 'Reach SQL Level 3 to create courses.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enrollments */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Student Enrollments</h2>
            </div>

            <StudentTable
              enrollments={enrollments}
              onMarkComplete={handleMarkComplete}
              onCancelEnrollment={handleCancelEnrollment}
            />
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Course"
        >
          <CourseEditor
            onSubmit={handleCreateCourse}
            onCancel={() => setShowCreateModal(false)}
            isVerified={tutor.sqlLevel >= 3}
          />
        </Modal>
      )}
    </div>
  );
}
