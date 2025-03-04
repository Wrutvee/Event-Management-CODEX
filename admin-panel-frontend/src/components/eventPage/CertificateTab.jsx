import React, { useState } from 'react';
import { Download, Users, AlertCircle } from 'lucide-react';
import { addCsrfToken, fetchCsrfToken } from '../../utils/csrf';

export default function CertificateTab({ eventData, setEventData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/${eventData._id}/registered-users`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      // Store all registrations
      setParticipants(data.registrations);
      setSelectedUsers(new Set()); // Reset selections when fetching new data
    } catch (err) {
      setError(err.message || 'Failed to fetch participants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableCertificates = async () => {
    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/${eventData._id}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...addCsrfToken()
          },
          credentials: 'include',
          body: JSON.stringify({
            certificates: {
              willItBeProvided: true
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to enable certificates');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      // Update local event data
      setEventData(prev => ({
        ...prev,
        certificates: {
          ...prev.certificates,
          willItBeProvided: true
        }
      }));

    } catch (err) {
      setError(err.message || 'Failed to enable certificates');
    }
  };

  const handleGenerateCertificates = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      await fetchCsrfToken();

      // Get selected users data
      const selectedParticipants = participants.filter(user => 
        selectedUsers.has(user.email)
      );

      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/${eventData._id}/generate-certificates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...addCsrfToken()
          },
          credentials: 'include',
          body: JSON.stringify({
            users: selectedParticipants.map(user => ({
              name: user.name,
              email: user.email
            }))
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to initiate certificate generation');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      // Show success message
      alert('Certificate generation initiated. Users will be notified when certificates are ready.');
      setSelectedUsers(new Set()); // Clear selections

    } catch (err) {
      setError(err.message || 'Failed to generate certificates');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === participants.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(participants.map(p => p.email)));
    }
  };

  const toggleUserSelection = (email) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedUsers(newSelected);
  };

  if (!eventData.certificates?.willItBeProvided) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Certificates Not Enabled
        </h3>
        <p className="text-gray-500 text-center mb-6">
          Enable certificates to start generating them for event participants.
        </p>
        <button
          onClick={handleEnableCertificates}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Enable Certificates
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Certificates</h3>
          <p className="text-sm text-gray-500">Generate certificates for event participants</p>
        </div>
        <button
          onClick={fetchParticipants}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Users className="w-4 h-4 mr-2" />
              Fetch Participants
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {participants.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedUsers.size === participants.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Select All ({selectedUsers.size} selected)
              </span>
            </div>
            <button
              onClick={handleGenerateCertificates}
              disabled={selectedUsers.size === 0 || isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Certificates'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((user) => {
                  // Find attendee by matching email
                  const attendee = eventData.attendees?.find(a => {
                    return user.email === eventData.registeredUsers?.find(
                      ru => ru._id === a.userId
                    )?.email;
                  });

                  return (
                    <tr key={user.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.email)}
                          onChange={() => toggleUserSelection(user.email)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendee ? new Date(attendee.checkInTime).toLocaleString() : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}