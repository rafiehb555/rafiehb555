import { useState } from 'react';
import { FiSearch, FiFilter, FiStar, FiMapPin, FiBriefcase } from 'react-icons/fi';

interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  location: string;
  chamber: string;
  hourlyRate: number;
  isAvailable: boolean;
  sqlLevel: number;
}

export default function LawyerDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Mock data - replace with API call
  const lawyers: Lawyer[] = [
    {
      id: '1',
      name: 'John Smith',
      specialization: 'Corporate Law',
      experience: 15,
      rating: 4.8,
      location: 'New York',
      chamber: 'Smith & Associates',
      hourlyRate: 250,
      isAvailable: true,
      sqlLevel: 3,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      specialization: 'Family Law',
      experience: 10,
      rating: 4.9,
      location: 'Los Angeles',
      chamber: 'Johnson Legal',
      hourlyRate: 200,
      isAvailable: true,
      sqlLevel: 2,
    },
  ];

  const specializations = ['all', 'Corporate Law', 'Family Law', 'Criminal Law', 'Real Estate'];
  const locations = ['all', 'New York', 'Los Angeles', 'Chicago', 'Houston'];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === 'all' || lawyer.specialization === selectedSpecialization;
    const matchesLocation = selectedLocation === 'all' || lawyer.location === selectedLocation;
    return matchesSearch && matchesSpecialization && matchesLocation;
  });

  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search lawyers by name or specialization..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FiFilter className="h-5 w-5 text-gray-400" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedSpecialization}
              onChange={e => setSelectedSpecialization(e.target.value)}
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specializations' : spec}
                </option>
              ))}
            </select>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc === 'all' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lawyers List */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLawyers.map(lawyer => (
          <div
            key={lawyer.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{lawyer.name}</h3>
                <span className="flex items-center text-yellow-400">
                  <FiStar className="h-5 w-5" />
                  <span className="ml-1 text-sm font-medium text-gray-900">{lawyer.rating}</span>
                </span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FiBriefcase className="h-4 w-4 mr-2" />
                  {lawyer.specialization} • {lawyer.experience} years
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiMapPin className="h-4 w-4 mr-2" />
                  {lawyer.location} • {lawyer.chamber}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-semibold text-gray-900">
                    ${lawyer.hourlyRate}/hr
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      lawyer.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {lawyer.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    /* Handle booking */
                  }}
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
