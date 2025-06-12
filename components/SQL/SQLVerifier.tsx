import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiUser, FiFileText, FiAward } from 'react-icons/fi';
import { SQLLevel } from './SQLLevelBadge';
import SQLLevelBadge from './SQLLevelBadge';

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  currentLevel: SQLLevel;
  targetLevel: SQLLevel;
  documents: {
    id: string;
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface SQLVerifierProps {
  requests: VerificationRequest[];
  onApprove: (requestId: string, notes?: string) => void;
  onReject: (requestId: string, notes: string) => void;
  onDocumentApprove: (requestId: string, documentId: string) => void;
  onDocumentReject: (requestId: string, documentId: string, reason: string) => void;
  className?: string;
}

export default function SQLVerifier({
  requests,
  onApprove,
  onReject,
  onDocumentApprove,
  onDocumentReject,
  className = '',
}: SQLVerifierProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [documentRejectReason, setDocumentRejectReason] = useState('');

  const getStatusColor = (status: VerificationRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'kyc':
        return <FiUser className="w-5 h-5" />;
      case 'certificate':
        return <FiAward className="w-5 h-5" />;
      default:
        return <FiFileText className="w-5 h-5" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">SQL Verification Requests</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Total:</span>
          <span className="text-sm font-medium text-gray-900">{requests.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map(request => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              p-4 rounded-lg border
              ${getStatusColor(request.status)}
              ${selectedRequest === request.id ? 'ring-2 ring-blue-500' : ''}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">{request.userName}</span>
                  <span className="text-gray-400">→</span>
                  <SQLLevelBadge level={request.currentLevel} size="sm" />
                  <span className="text-gray-400">→</span>
                  <SQLLevelBadge level={request.targetLevel} size="sm" />
                </div>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onApprove(request.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <FiCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedRequest(request.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {selectedRequest === request.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-4"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter reason for rejection..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onReject(request.id, rejectReason);
                      setSelectedRequest(null);
                      setRejectReason('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Reject Request
                  </button>
                </div>
              </motion.div>
            )}

            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Documents</h4>
              {request.documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    {getDocumentIcon(doc.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                  {doc.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onDocumentApprove(request.id, doc.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) {
                            onDocumentReject(request.id, doc.id, reason);
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {doc.status !== 'pending' && (
                    <span
                      className={`text-sm ${
                        doc.status === 'approved' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {doc.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No verification requests</h3>
          <p className="mt-2 text-sm text-gray-500">
            There are no pending SQL level upgrade requests to verify.
          </p>
        </div>
      )}
    </div>
  );
}
