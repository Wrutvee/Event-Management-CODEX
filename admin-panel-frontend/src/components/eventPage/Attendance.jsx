import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Switch } from '@headlessui/react';
import { ChevronDown, Camera, Plus } from 'lucide-react';
import { addCsrfToken, fetchCsrfToken } from '../../utils/csrf';

export default function AttendanceTab({ eventData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [openSections, setOpenSections] = useState([]);
  const [attendance, setAttendance] = useState({
    isRequired: eventData.attendance?.isRequired || false,
    qrCheckin: eventData.attendance?.qrCheckin || false,
    manualCheckin: eventData.attendance?.manualCheckin || false
  });

  const toggleSection = (sectionId) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleAttendanceChange = async (field, value) => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/${eventData._id}/update-attendance-mode`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...addCsrfToken()
          },
          credentials: 'include',
          body: JSON.stringify({
            [field]: value
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update attendance settings');
      }

      setAttendance(prev => ({
        ...prev,
        [field]: value,
        isRequired: field === 'isRequired' ? value : (value || prev.qrCheckin || prev.manualCheckin)
      }));

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAttendance = async (userId, checkInMethod) => {
    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/${eventData._id}/mark-attendance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...addCsrfToken()
          },
          credentials: 'include',
          body: JSON.stringify({
            userId,
            checkInMethod
          })
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark attendance');
      }

      // Show success message
      alert('Attendance marked successfully!');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleQRScan = async (result) => {
    if (result) {
      try {
        // QR code should contain the user ID
        const userId = result[0].rawValue;
        console.log(result[0].rawValue)
        const success = await handleMarkAttendance(userId, 'qr');
        if (success) {
          setShowQRScanner(false);
        }
      } catch (err) {
        setError('Invalid QR code');
      }
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      try {
        // Manual code should be the user ID
        const success = await handleMarkAttendance(manualCode.trim(), 'manual');
        if (success) {
          setManualCode('');
        }
      } catch (err) {
        setError('Invalid attendance code');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Main Attendance Toggle */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Attendance Collection</h3>
          <p className="text-sm text-gray-500">Enable or disable attendance tracking</p>
        </div>
        <Switch
          checked={attendance.isRequired}
          onChange={(checked) => handleAttendanceChange('isRequired', checked)}
          disabled={isLoading}
          className={`${
            attendance.isRequired ? 'bg-indigo-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <span className={`${
            attendance.isRequired ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
        </Switch>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {attendance.isRequired && (
        <div className="space-y-4">
          {/* QR Check-in Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div
              onClick={() => toggleSection('qr')}
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">QR Check-in</h3>
                <p className="text-sm text-gray-500">Scan QR codes for attendance</p>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={attendance.qrCheckin}
                  onChange={(checked) => handleAttendanceChange('qrCheckin', checked)}
                  disabled={isLoading}
                  className={`${
                    attendance.qrCheckin ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span className={`${
                    attendance.qrCheckin ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                </Switch>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openSections.includes('qr') ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {openSections.includes('qr') && (
              <div className="p-4 border-t">
                {attendance.qrCheckin ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowQRScanner(prev => !prev)}
                      className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      {showQRScanner ? 'Stop Scanner' : 'Start QR Scanner'}
                    </button>
                    {showQRScanner && (
                      <div className="aspect-square max-w-md mx-auto">
                        <Scanner
                          onScan={handleQRScan}
                          onError={(error) => {
                            console.error('QR Scan error:', error?.message);
                          }}
                          constraints={{
                            facingMode: 'environment'
                          }}
                          scanDelay={500}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Enable QR check-in to scan attendance
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Manual Check-in Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div
              onClick={() => toggleSection('manual')}
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">Manual Check-in</h3>
                <p className="text-sm text-gray-500">Enter attendance codes manually</p>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={attendance.manualCheckin}
                  onChange={(checked) => handleAttendanceChange('manualCheckin', checked)}
                  disabled={isLoading}
                  className={`${
                    attendance.manualCheckin ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span className={`${
                    attendance.manualCheckin ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                </Switch>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openSections.includes('manual') ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {openSections.includes('manual') && (
              <div className="p-4 border-t">
                {attendance.manualCheckin ? (
                  <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="Enter attendance code"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!manualCode.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Enable manual check-in to enter codes
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}