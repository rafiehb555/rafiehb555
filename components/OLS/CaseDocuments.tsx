import { useState } from 'react';
import { FiUpload, FiFile, FiDownload, FiTrash2, FiEye } from 'react-icons/fi';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

export default function CaseDocuments() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Contract Agreement.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedAt: '2024-02-20',
      status: 'verified',
    },
    {
      id: '2',
      name: 'Legal Notice.docx',
      type: 'DOCX',
      size: '1.8 MB',
      uploadedAt: '2024-02-19',
      status: 'pending',
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    // TODO: Implement file upload logic
    setTimeout(() => {
      setIsUploading(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Case Documents</h2>
        <p className="mt-1 text-sm text-gray-500">Upload and manage your legal documents</p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, DOCX, or images up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map(document => (
            <li key={document.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiFile className="h-5 w-5 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{document.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{document.type}</span>
                        <span className="mx-2">•</span>
                        <span>{document.size}</span>
                        <span className="mx-2">•</span>
                        <span>Uploaded {document.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(document.status)}`}
                    >
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => {
                          /* Handle view */
                        }}
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => {
                          /* Handle download */
                        }}
                      >
                        <FiDownload className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(document.id)}
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
