import { motion } from 'framer-motion';
import { Enrollment } from '@/lib/models/Enrollment';
import { FaUser, FaEnvelope, FaGraduationCap, FaStar, FaCheck, FaTimes } from 'react-icons/fa';

interface StudentTableProps {
  enrollments: (Enrollment & {
    student: {
      name: string;
      email: string;
      sqlLevel: number;
    };
  })[];
  onMarkComplete: (enrollmentId: string) => void;
  onCancelEnrollment: (enrollmentId: string) => void;
}

export default function StudentTable({
  enrollments,
  onMarkComplete,
  onCancelEnrollment,
}: StudentTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SQL Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.map((enrollment, index) => (
              <motion.tr
                key={enrollment._id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.student.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaEnvelope className="w-4 h-4 mr-1" />
                        {enrollment.student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaGraduationCap className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-900">
                      Level {enrollment.student.sqlLevel}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      enrollment.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : enrollment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {enrollment.rating ? (
                    <div className="flex items-center">
                      <FaStar className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-900">{enrollment.rating}/5</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not rated</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {enrollment.status === 'active' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onMarkComplete(enrollment._id.toString())}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        <FaCheck className="w-4 h-4 mr-1" />
                        Complete
                      </button>
                      <button
                        onClick={() => onCancelEnrollment(enrollment._id.toString())}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <FaTimes className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}

            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No enrollments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
