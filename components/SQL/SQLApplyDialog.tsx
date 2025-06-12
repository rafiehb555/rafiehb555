import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { SQLLevel } from './SQLLevelBadge';
import SQLLevelBadge from './SQLLevelBadge';

interface SQLApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: SQLLevel;
  targetLevel: SQLLevel;
  onSubmit: (data: { documents: File[]; notes: string }) => void;
  className?: string;
}

const levelConfig = {
  0: {
    name: 'Free',
    nextLevel: 'Basic',
    requiredDocuments: ['KYC Document', 'ID Proof'],
  },
  1: {
    name: 'Basic',
    nextLevel: 'Normal',
    requiredDocuments: ['EDR Test Certificate', 'Skill Assessment'],
  },
  2: {
    name: 'Normal',
    nextLevel: 'High',
    requiredDocuments: ['EMO Verification', 'Live Check Report'],
  },
  3: {
    name: 'High',
    nextLevel: 'VIP',
    requiredDocuments: ['Income Proof', 'Trust Score Report'],
  },
  4: {
    name: 'VIP',
    nextLevel: null,
    requiredDocuments: [],
  },
};

export default function SQLApplyDialog({
  isOpen,
  onClose,
  currentLevel,
  targetLevel,
  onSubmit,
  className = '',
}: SQLApplyDialogProps) {
  const [documents, setDocuments] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = levelConfig[currentLevel];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      await onSubmit({ documents, notes });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Apply for {config.nextLevel} Level
                      </h3>
                      <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center space-x-3">
                      <SQLLevelBadge level={currentLevel} size="md" />
                      <span className="text-gray-400">→</span>
                      <SQLLevelBadge level={targetLevel} size="md" />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Required Documents
                        </label>
                        <div className="mt-2 space-y-2">
                          {config.requiredDocuments.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="text-sm text-gray-600">{doc}</span>
                              <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id={`file-${index}`}
                              />
                              <label
                                htmlFor={`file-${index}`}
                                className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 cursor-pointer"
                              >
                                Upload
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {documents.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Uploaded Documents
                          </label>
                          <div className="mt-2 space-y-2">
                            {documents.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white border rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <FiUpload className="w-5 h-5 text-gray-400" />
                                  <span className="text-sm text-gray-600">{file.name}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <FiX className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Additional Notes
                        </label>
                        <textarea
                          id="notes"
                          rows={3}
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Add any additional information..."
                        />
                      </div>

                      {error && (
                        <div className="rounded-md bg-red-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <FiAlertCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{error}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={uploading || documents.length === 0}
                          className={`
                            w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2
                            text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm
                            ${
                              uploading || documents.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }
                          `}
                        >
                          {uploading ? 'Submitting...' : 'Submit Application'}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
