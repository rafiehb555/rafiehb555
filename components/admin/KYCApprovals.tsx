import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface KYCRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  type: 'tutor' | 'doctor' | 'shop' | 'franchise';
  documents: {
    id: string;
    type: string;
    url: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface KYCApprovalsProps {
  requests: KYCRequest[];
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
}

export default function KYCApprovals({ requests, onApprove, onReject }: KYCApprovalsProps) {
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async (requestId: string) => {
    try {
      setIsLoading(true);
      await onApprove(requestId);
      toast.success('KYC request approved successfully');
      setSelectedRequest(null);
    } catch (error) {
      toast.error('Failed to approve KYC request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setIsLoading(true);
      await onReject(requestId, rejectionReason);
      toast.success('KYC request rejected');
      setSelectedRequest(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Failed to reject KYC request');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: KYCRequest['type']) => {
    switch (type) {
      case 'tutor':
        return '👨‍🏫';
      case 'doctor':
        return '👨‍⚕️';
      case 'shop':
        return '🏪';
      case 'franchise':
        return '🏢';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">KYC Approvals</h2>

      <div className="space-y-4">
        {requests.map(request => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FaUser className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{request.name}</p>
                <p className="text-sm text-gray-500">{request.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm">{getTypeIcon(request.type)}</span>
                  <span className="text-xs text-gray-500">
                    Submitted {formatDate(request.submittedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedRequest(request)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title="View Documents"
              >
                <FaEye className="w-5 h-5" />
              </button>
              {request.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={isLoading}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    title="Approve"
                  >
                    <FaCheck className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setRejectionReason('');
                    }}
                    disabled={isLoading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Reject"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  KYC Documents for {selectedRequest.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedRequest.email}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {selectedRequest.documents.map(doc => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <p className="font-medium text-gray-900 mb-2">{doc.type}</p>
                    <img
                      src={doc.url}
                      alt={doc.type}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                    >
                      {isLoading ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(selectedRequest.id)}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                    >
                      {isLoading ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
