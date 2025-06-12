'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Course } from '@/lib/models/Course';
import { Tutor } from '@/lib/models/Tutor';
import { Wallet } from '@/lib/models/Wallet';
import { calculateLoyaltyDiscount } from '@/lib/utils/franchiseUtils';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal';

export default function CourseListing() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutors, setTutors] = useState<{ [key: string]: Tutor }>({});
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    subject: '',
    city: '',
    mode: '',
    maxFee: '',
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchCourses();
      fetchWallet();
    }
  }, [session?.user?.id, filters]);

  const fetchCourses = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.mode) queryParams.append('mode', filters.mode);
      if (filters.maxFee) queryParams.append('maxFee', filters.maxFee);

      const response = await fetch(`/api/courses?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.courses);

      // Fetch tutor details for each course
      const tutorIds = [...new Set(data.courses.map((course: Course) => course.tutorId))];
      const tutorPromises = tutorIds.map(id => fetch(`/api/tutors/${id}`).then(res => res.json()));
      const tutorData = await Promise.all(tutorPromises);
      const tutorMap = tutorData.reduce((acc: { [key: string]: Tutor }, tutor: Tutor) => {
        acc[tutor._id.toString()] = tutor;
        return acc;
      }, {});
      setTutors(tutorMap);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await fetch('/api/wallet');
      if (!response.ok) throw new Error('Failed to fetch wallet');
      const data = await response.json();
      setWallet(data.wallet);
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  };

  const handleBookCourse = async (course: Course) => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    const discount = calculateLoyaltyDiscount(wallet.coinLock);
    const finalPrice = course.price * (1 - discount);

    if (wallet.balance < finalPrice) {
      toast.error('Insufficient balance in wallet');
      return;
    }

    setSelectedCourse(course);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedCourse) return;

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse._id,
          schedule: selectedCourse.schedule,
        }),
      });

      if (!response.ok) throw new Error('Failed to book course');

      toast.success('Course booked successfully!');
      setShowBookingModal(false);
      setSelectedCourse(null);
      fetchWallet(); // Refresh wallet balance
    } catch (err) {
      toast.error('Failed to book course');
      console.error('Error booking course:', err);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Course</h1>
          <p className="text-xl text-gray-600">
            Learn from verified tutors with SQL level 3 or higher
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.subject}
              onChange={e => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="computer-science">Computer Science</option>
            </select>

            <select
              value={filters.city}
              onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              <option value="karachi">Karachi</option>
              <option value="lahore">Lahore</option>
              <option value="islamabad">Islamabad</option>
              <option value="peshawar">Peshawar</option>
              <option value="quetta">Quetta</option>
            </select>

            <select
              value={filters.mode}
              onChange={e => setFilters(prev => ({ ...prev, mode: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Modes</option>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
            </select>

            <input
              type="number"
              placeholder="Max Fee (coins)"
              value={filters.maxFee}
              onChange={e => setFilters(prev => ({ ...prev, maxFee: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const tutor = tutors[course.tutorId.toString()];
            const discount = wallet ? calculateLoyaltyDiscount(wallet.coinLock) : 0;
            const finalPrice = course.price * (1 - discount);

            return (
              <motion.div
                key={course._id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                    <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                      SQL {tutor?.sqlLevel || 3}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{course.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Tutor:</span>
                      {tutor?.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Subject:</span>
                      {course.subject}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Schedule:</span>
                      {course.schedule}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Mode:</span>
                      {course.mode}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium mr-2">Location:</span>
                      {course.city}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-gray-900">{finalPrice} coins</p>
                      {discount > 0 && (
                        <p className="text-sm text-green-600">
                          {discount * 100}% loyalty discount applied
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleBookCourse(course)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {courses.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No courses found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedCourse && (
        <Modal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title="Confirm Course Booking"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              You are about to book the course "{selectedCourse.title}" with{' '}
              {tutors[selectedCourse.tutorId.toString()]?.name}
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Schedule: {selectedCourse.schedule}</p>
                <p>Mode: {selectedCourse.mode}</p>
                <p>Location: {selectedCourse.city}</p>
                <p>
                  Price:{' '}
                  {selectedCourse.price * (1 - calculateLoyaltyDiscount(wallet?.coinLock || 0))}{' '}
                  coins
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
