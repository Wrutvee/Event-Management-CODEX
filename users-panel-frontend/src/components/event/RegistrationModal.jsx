import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

export default function RegistrationModal({ event, onSubmit, onClose }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check required fields
      const missingFields = event.registration.formFields
        .filter(field => field.required && !formData[field.id])
        .map(field => field.label);

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      if (event.registration.additionalInfo?.required && !formData.additionalInfo) {
        toast.error('Additional information is required');
        return;
      }

      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Registration Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Registration Form Fields */}
          {event.registration.formFields?.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                required={field.required}
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}

          {/* Additional Info Question */}
          {event.registration.additionalInfo?.required && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {event.registration.additionalInfo.question}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.additionalInfo || ''}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Team Size Notice */}
          {event.capacity.isTeamFormationRequired && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                This event requires team formation. Teams should have {event.capacity.minTeamSize}-{event.capacity.maxTeamSize} members.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}