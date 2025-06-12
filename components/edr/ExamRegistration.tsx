import { useState } from 'react';
import { FiUpload, FiAlertCircle } from 'react-icons/fi';

interface ExamRegistrationProps {
  onViewChange: (view: string) => void;
}

interface RegistrationForm {
  examId: string;
  category: string;
  documents: File[];
  notes: string;
}

export default function ExamRegistration({ onViewChange }: ExamRegistrationProps) {
  const [formData, setFormData] = useState<RegistrationForm>({
    examId: '',
    category: '',
    documents: [],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock exam categories - replace with API call
  const examCategories = [
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'technology', name: 'Technology' },
    { id: 'legal', name: 'Legal Services' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const formDataToSend = new FormData();
      formDataToSend.append('examId', formData.examId);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('notes', formData.notes);
      formData.documents.forEach((file, index) => {
        formDataToSend.append(`document${index}`, file);
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // On success, redirect to dashboard
      onViewChange('dashboard');
    } catch (err) {
      setError('Failed to register for exam. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Register for Exam</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Please fill out the form below to register for your selected exam. Make sure to upload
              all required documents.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Exam Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select a category</option>
                {examCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                Required Documents
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>
              {formData.documents.length > 0 && (
                <ul className="mt-2 divide-y divide-gray-200">
                  {formData.documents.map((file, index) => (
                    <li key={index} className="py-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{file.name}</span>
                      <span className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onViewChange('dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Registering...' : 'Register for Exam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
