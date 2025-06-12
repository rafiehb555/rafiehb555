'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Appointment } from '@/lib/models/Appointment';
import { Doctor } from '@/lib/models/Doctor';
import Modal from '@/components/ui/Modal';

interface AppointmentWithDoctor extends Appointment {
  doctor: Doctor;
}

interface RescheduleModalProps {
  appointment: AppointmentWithDoctor;
  onClose: () => void;
  onConfirm: (date: string, timeSlot: string) => Promise<void>;
}

function RescheduleModal({ appointment, onClose, onConfirm }: RescheduleModalProps) {
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
      const response = await fetch(
        `/api/availability?doctorId=${appointment.doctorId}&date=${date}`
      );
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
      setError(err instanceof Error ? err.message : 'Failed to reschedule appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Reschedule Appointment</h2>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Select New Date</label>
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
          <label className="mb-2 block text-sm font-medium">Select New Time Slot</label>
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
          {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
        </button>
      </div>
    </div>
  );
}

export default function MyAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDoctor | null>(
    null
  );

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppointments();
    }
  }, [session]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments/my-appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data.appointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (date: string, timeSlot: string) => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, timeSlot }),
      });

      if (!response.ok) throw new Error('Failed to reschedule appointment');

      // Refresh appointments list
      fetchAppointments();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to reschedule appointment');
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel appointment');

      // Refresh appointments list
      fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
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
      <h1 className="mb-8 text-2xl font-bold">My Appointments</h1>

      <div className="space-y-4">
        {appointments.map(appointment => (
          <motion.div
            key={appointment._id.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Dr. {appointment.doctor.name}</h3>
                <p className="text-sm text-gray-600">{appointment.doctor.specialty}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  appointment.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>

            <div className="mb-4 space-y-2 text-sm">
              <p className="flex items-center text-gray-600">
                <span className="mr-2">🏥</span> {appointment.doctor.hospital}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">📅</span> {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">⏰</span> {appointment.timeSlot}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">💰</span> Fee: ${appointment.doctor.fee}
              </p>
            </div>

            <div className="flex space-x-4">
              {appointment.status === 'pending' && (
                <>
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="flex-1 rounded-lg border border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-50"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(appointment._id.toString())}
                    className="flex-1 rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}

        {appointments.length === 0 && (
          <div className="rounded-lg bg-white p-6 text-center text-gray-500">
            No appointments found. Book your first appointment now!
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      <Modal open={!!selectedAppointment} onClose={() => setSelectedAppointment(null)}>
        {selectedAppointment && (
          <RescheduleModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onConfirm={handleReschedule}
          />
        )}
      </Modal>
    </div>
  );
}
