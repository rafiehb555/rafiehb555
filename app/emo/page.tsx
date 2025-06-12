'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Doctor } from '@/lib/models/Doctor';
import Modal from '@/components/ui/Modal';

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
  onConfirm: (date: string, timeSlot: string) => Promise<void>;
}

function BookingModal({ doctor, onClose, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/availability?doctorId=${doctor._id}&date=${date}`);
      if (!response.ok) throw new Error('Failed to fetch slots');
      const data = await response.json();
      setAvailableSlots(data.slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slots');
    }
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) {
      setError('Please select both date and time slot');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(selectedDate, selectedSlot);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Book Appointment with Dr. {doctor.name}</h2>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full rounded-lg border border-gray-300 p-2"
        />
      </div>

      {selectedDate && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Select Time Slot</label>
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-lg p-2 text-sm ${
                  selectedSlot === slot ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

export default function EMOPage() {
  const { data: session } = useSession();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filters, setFilters] = useState({
    city: '',
    specialty: '',
    hospital: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        minSqlLevel: '3',
      });
      const response = await fetch(`/api/doctors?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setDoctors(data.doctors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (date: string, timeSlot: string) => {
    if (!selectedDoctor || !session?.user?.id) return;

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          patientId: session.user.id,
          date,
          timeSlot,
        }),
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      // Refresh doctors list
      fetchDoctors();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to book appointment');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select
          value={filters.city}
          onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="">All Cities</option>
          <option value="Karachi">Karachi</option>
          <option value="Lahore">Lahore</option>
          <option value="Islamabad">Islamabad</option>
        </select>

        <select
          value={filters.specialty}
          onChange={e => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="">All Specialties</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>

        <select
          value={filters.hospital}
          onChange={e => setFilters(prev => ({ ...prev, hospital: e.target.value }))}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="">All Hospitals</option>
          <option value="Aga Khan">Aga Khan</option>
          <option value="Shaukat Khanum">Shaukat Khanum</option>
          <option value="Shifa">Shifa</option>
        </select>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map(doctor => (
          <motion.div
            key={doctor._id.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Dr. {doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                SQL {doctor.sqlLevel}
              </span>
            </div>

            <div className="mb-4 space-y-2 text-sm">
              <p className="flex items-center text-gray-600">
                <span className="mr-2">🏥</span> {doctor.hospital}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">📍</span> {doctor.city}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">💰</span> Fee: ${doctor.fee}
              </p>
            </div>

            <button
              onClick={() => setSelectedDoctor(doctor)}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Book Appointment
            </button>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal open={!!selectedDoctor} onClose={() => setSelectedDoctor(null)}>
        {selectedDoctor && (
          <BookingModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
            onConfirm={handleBooking}
          />
        )}
      </Modal>
    </div>
  );
}
