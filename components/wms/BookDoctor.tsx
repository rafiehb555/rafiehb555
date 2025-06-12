import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiStar, FiCalendar, FiClock } from 'react-icons/fi';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: number;
  location: string;
  sqlLevel: 'free' | 'basic' | 'normal';
  availability: {
    date: string;
    slots: string[];
  }[];
}

// Mock data - replace with API calls
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    rating: 4.8,
    experience: 15,
    location: 'New York Medical Center',
    sqlLevel: 'normal',
    availability: [
      {
        date: '2024-03-15',
        slots: ['09:00', '10:00', '11:00'],
      },
      {
        date: '2024-03-16',
        slots: ['14:00', '15:00', '16:00'],
      },
    ],
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    rating: 4.6,
    experience: 12,
    location: 'Central Hospital',
    sqlLevel: 'normal',
    availability: [
      {
        date: '2024-03-15',
        slots: ['13:00', '14:00', '15:00'],
      },
    ],
  },
];

const specializations = [
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'General Medicine',
];

export default function BookDoctor() {
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialization =
      !selectedSpecialization || doctor.specialization === selectedSpecialization;
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialization && matchesSearch;
  });

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;

    // TODO: Implement booking logic
    console.log('Booking:', {
      doctor: selectedDoctor.name,
      date: selectedDate,
      time: selectedSlot,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Book a Doctor</h2>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedSpecialization}
            onChange={e => setSelectedSpecialization(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor List */}
      <div className="space-y-4">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            className={`border rounded-lg p-4 ${
              selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialization}</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    {doctor.location}
                  </div>
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                    {doctor.rating}
                  </div>
                  <div>{doctor.experience} years experience</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Book Now
              </button>
            </div>

            {/* Availability Calendar */}
            {selectedDoctor?.id === doctor.id && (
              <div className="mt-4 space-y-4">
                <h4 className="font-medium text-gray-900">Select Date and Time</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {doctor.availability.map(day => (
                    <div
                      key={day.date}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedDate === day.date ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(day.date).toLocaleDateString()}</span>
                      </div>
                      {selectedDate === day.date && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {day.slots.map(slot => (
                            <button
                              key={slot}
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedSlot(slot);
                              }}
                              className={`px-2 py-1 text-sm rounded ${
                                selectedSlot === slot
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <FiClock className="w-3 h-3 mr-1" />
                                {slot}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedDate && selectedSlot && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleBooking}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Confirm Booking
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
