import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Course } from '@/lib/models/Course';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaChalkboardTeacher,
} from 'react-icons/fa';

interface CourseEditorProps {
  course?: Course;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isVerified: boolean;
}

export default function CourseEditor({
  course,
  onSubmit,
  onCancel,
  isVerified,
}: CourseEditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: course || {
      title: '',
      description: '',
      subject: '',
      price: '',
      schedule: {
        days: [],
        times: [],
      },
      city: '',
      mode: 'online',
    },
  });

  const [selectedDays, setSelectedDays] = useState<string[]>(course?.schedule.days || []);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(course?.schedule.times || []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '9:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
  ];

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
  };

  const handleTimeToggle = (time: string) => {
    setSelectedTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const onFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      schedule: {
        days: selectedDays,
        times: selectedTimes,
      },
    });
  };

  if (!isVerified) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <FaChalkboardTeacher className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Verification Required</h3>
        <p className="text-yellow-600">
          You need to reach SQL Level 3 to create and manage courses.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <select
          {...register('subject', { required: 'Subject is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a subject</option>
          <option value="mathematics">Mathematics</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
          <option value="biology">Biology</option>
          <option value="computer-science">Computer Science</option>
        </select>
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price (coins)</label>
        <input
          type="number"
          {...register('price', {
            required: 'Price is required',
            min: { value: 1, message: 'Price must be at least 1 coin' },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
        <div className="space-y-4">
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <FaCalendarAlt className="w-5 h-5 mr-2" />
              <span>Days</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {days.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedDays.includes(day)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <FaClock className="w-5 h-5 mr-2" />
              <span>Time Slots</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeToggle(time)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTimes.includes(time)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">City</label>
        <select
          {...register('city', { required: 'City is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a city</option>
          <option value="karachi">Karachi</option>
          <option value="lahore">Lahore</option>
          <option value="islamabad">Islamabad</option>
          <option value="peshawar">Peshawar</option>
          <option value="quetta">Quetta</option>
        </select>
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mode</label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('mode')}
              value="online"
              className="form-radio text-blue-600"
            />
            <span className="ml-2 flex items-center">
              <FaVideo className="w-4 h-4 mr-1" />
              Online
            </span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('mode')}
              value="onsite"
              className="form-radio text-blue-600"
            />
            <span className="ml-2 flex items-center">
              <FaMapMarkerAlt className="w-4 h-4 mr-1" />
              Onsite
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {course ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}
