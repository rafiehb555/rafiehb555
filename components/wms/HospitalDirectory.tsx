import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiStar, FiCheckCircle, FiPhone, FiGlobe } from 'react-icons/fi';

interface Hospital {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'medical-center';
  rating: number;
  location: string;
  contact: string;
  website: string;
  verified: boolean;
  specialties: string[];
  sqlLevel: 'free' | 'basic' | 'normal';
}

// Mock data - replace with API calls
const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'New York Medical Center',
    type: 'hospital',
    rating: 4.7,
    location: 'New York, USA',
    contact: '+1 (555) 123-4567',
    website: 'www.nymc.com',
    verified: true,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
    sqlLevel: 'normal',
  },
  {
    id: '2',
    name: 'Central Health Clinic',
    type: 'clinic',
    rating: 4.5,
    location: 'Boston, USA',
    contact: '+1 (555) 987-6543',
    website: 'www.centralhealth.com',
    verified: true,
    specialties: ['General Medicine', 'Pediatrics'],
    sqlLevel: 'basic',
  },
];

const hospitalTypes = ['All', 'Hospital', 'Clinic', 'Medical Center'];

export default function HospitalDirectory() {
  const [hospitals] = useState<Hospital[]>(mockHospitals);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesType = selectedType === 'All' || hospital.type === selectedType.toLowerCase();
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Hospital Directory</h2>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {hospitalTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospital List */}
      <div className="space-y-4">
        {filteredHospitals.map(hospital => (
          <div
            key={hospital.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                  {hospital.verified && (
                    <FiCheckCircle className="w-5 h-5 text-green-500" title="Verified Hospital" />
                  )}
                </div>
                <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                  <span className="capitalize">{hospital.type}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{hospital.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                {hospital.location}
              </div>
              <div className="flex items-center">
                <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                {hospital.contact}
              </div>
              <div className="flex items-center">
                <FiGlobe className="w-4 h-4 mr-2 text-gray-400" />
                <a
                  href={`https://${hospital.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {hospital.website}
                </a>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h4>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                SQL {hospital.sqlLevel}
              </span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
