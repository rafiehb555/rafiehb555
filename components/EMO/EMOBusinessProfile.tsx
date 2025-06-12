import { useState } from 'react';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

interface BusinessData {
  name: string;
  sqlLevel: number;
  services: number;
  orders: number;
  revenue: number;
}

interface EMOBusinessProfileProps {
  businessData: BusinessData;
}

export default function EMOBusinessProfile({ businessData }: EMOBusinessProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(businessData);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Call API to update business profile
      // await updateBusinessProfile(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating business profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedData(businessData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Business Profile</h3>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiEdit2 className="h-4 w-4 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiCheck className="h-4 w-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiX className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 px-5 py-5">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Business Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={e => setEditedData({ ...editedData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                editedData.name
              )}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">SQL Level</dt>
            <dd className="mt-1 text-sm text-gray-900">{editedData.sqlLevel}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Active Services</dt>
            <dd className="mt-1 text-sm text-gray-900">{editedData.services}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
            <dd className="mt-1 text-sm text-gray-900">{editedData.orders}</dd>
          </div>
        </dl>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            View verification status
          </a>
        </div>
      </div>
    </div>
  );
}
