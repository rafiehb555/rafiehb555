import React from 'react';
import { FiX, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface JPSCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  franchiseType: 'sub' | 'master' | 'corporate' | null;
}

const sqlLevelRequirements = {
  sub: 2,
  master: 3,
  corporate: 4,
};

export default function JPSCheckModal({ isOpen, onClose, franchiseType }: JPSCheckModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!isOpen || !franchiseType) return null;

  // Mock user SQL level - replace with actual data
  const userSqlLevel = 1;
  const requiredLevel = sqlLevelRequirements[franchiseType];
  const isEligible = userSqlLevel >= requiredLevel;

  const handleProceed = () => {
    if (isEligible) {
      router.push(`/franchise/apply/gosellr?type=${franchiseType}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                {isEligible ? (
                  <FiCheck className="h-6 w-6 text-green-600" />
                ) : (
                  <FiAlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isEligible
                    ? 'Eligible for Franchise Application'
                    : 'SQL Level Requirement Not Met'}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {isEligible
                      ? `You meet the SQL Level ${requiredLevel} requirement for ${franchiseType} franchise.`
                      : `This franchise type requires SQL Level ${requiredLevel}. Your current level is ${userSqlLevel}.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {isEligible ? (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleProceed}
              >
                Proceed to Application
              </button>
            ) : (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => router.push('/jps/upgrade')}
              >
                Upgrade SQL Level
              </button>
            )}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
