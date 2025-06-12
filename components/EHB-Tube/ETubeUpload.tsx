import React, { useState, useEffect } from 'react';
import { FiUpload, FiTag, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

interface VideoUploadForm {
  title: string;
  description: string;
  tags: string[];
  isVip: boolean;
  file: File | null;
}

interface UserVerification {
  sqlLevel: string;
  isVerified: boolean;
  hasPassedKyc: boolean;
  hasPassedEdr: boolean;
}

export default function ETubeUpload() {
  const [formData, setFormData] = useState<VideoUploadForm>({
    title: '',
    description: '',
    tags: [],
    isVip: false,
    file: null,
  });
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [userVerification, setUserVerification] = useState<UserVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implement API call to check user verification status
    const checkUserVerification = async () => {
      try {
        const response = await fetch('/api/ehb-tube/verify-creator');
        const data = await response.json();
        setUserVerification(data);
      } catch (error) {
        console.error('Error checking user verification:', error);
        setError('Failed to verify creator status');
      }
    };

    checkUserVerification();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userVerification?.isVerified) {
      setError('You must be a verified creator to upload videos');
      return;
    }

    if (!userVerification.hasPassedKyc || !userVerification.hasPassedEdr) {
      setError('You must complete KYC and EDR verification to upload videos');
      return;
    }

    if (formData.isVip && userVerification.sqlLevel === 'free') {
      setError('You must have a higher SQL level to upload VIP content');
      return;
    }

    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('isVip', String(formData.isVip));
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      const response = await fetch('/api/ehb-tube/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Reset form after successful upload
      setFormData({
        title: '',
        description: '',
        tags: [],
        isVip: false,
        file: null,
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!userVerification) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Video</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Video Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags and press Enter"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-indigo-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isVip"
            id="isVip"
            checked={formData.isVip}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={userVerification.sqlLevel === 'free'}
          />
          <label htmlFor="isVip" className="ml-2 block text-sm text-gray-900">
            VIP Content (SQL{' '}
            {userVerification.sqlLevel === 'free'
              ? 'Normal or higher required'
              : 'Normal or higher'}
            )
          </label>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Video File
          </label>
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
                    accept="video/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    required
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">MP4, WebM up to 500MB</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading || !userVerification.isVerified}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
}
