import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'pending' | 'suspended';
  category: string;
}

export default function EMOServiceList() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Web Development',
      description: 'Custom website development services',
      price: 1000,
      status: 'active',
      category: 'Technology',
    },
    {
      id: '2',
      name: 'Digital Marketing',
      description: 'Social media and SEO services',
      price: 500,
      status: 'active',
      category: 'Marketing',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({});

  const handleAdd = () => {
    setIsAdding(true);
    setNewService({});
  };

  const handleSave = async (service: Partial<Service>) => {
    try {
      // TODO: Call API to save service
      if (editingId) {
        setServices(
          services.map(s => (s.id === editingId ? ({ ...s, ...service } as Service) : s))
        );
        setEditingId(null);
      } else {
        setServices([...services, { ...service, id: Date.now().toString() } as Service]);
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Call API to delete service
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Services</h3>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="h-4 w-4 mr-1" />
            Add Service
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {services.map(service => (
            <li key={service.id} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
                  <p className="text-sm text-gray-500 truncate">{service.description}</p>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="mr-2">${service.price}</span>
                    <span className="mr-2">•</span>
                    <span>{service.category}</span>
                    <span className="mr-2">•</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        service.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : service.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => setEditingId(service.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {(isAdding || editingId) && (
        <div className="border-t border-gray-200 px-5 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Name</label>
              <input
                type="text"
                value={newService.name || ''}
                onChange={e => setNewService({ ...newService, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newService.description || ''}
                onChange={e => setNewService({ ...newService, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiX className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={() => handleSave(newService)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiCheck className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
