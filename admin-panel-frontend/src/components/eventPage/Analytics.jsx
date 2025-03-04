import React, { useState } from 'react';
import { BarChart3, ChevronDown, Users, Download } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CSVLink } from 'react-csv';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Analytics({ eventData }) {
  const [openSections, setOpenSections] = useState(['registration']);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSection = (categoryId) => {
    setOpenSections(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Calculate registration data
  const totalRegistered = eventData.registeredUsers?.length || 0;
  const maxCapacity = eventData.capacity?.maxParticipants || 0;
  const availableSpots = Math.max(0, maxCapacity - totalRegistered);
  const registrationPercentage = maxCapacity > 0 
    ? Math.round((totalRegistered / maxCapacity) * 100) 
    : 0;

  // Pie chart data
  const chartData = {
    labels: ['Registered', 'Available Spots'],
    datasets: [{
      data: [totalRegistered, availableSpots],
      backgroundColor: ['#4F46E5', '#E5E7EB'],
      borderColor: ['#4338CA', '#D1D5DB'],
      borderWidth: 1,
    }]
  };

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  const fetchRegisteredUsers = async () => {
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
        throw new Error('Failed to fetch registered users');
      }

      const data = await response.json();
      // Update to use the correct data structure
      setRegisteredUsers(data.registrations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update CSV data preparation to match the new structure
  const csvData = registeredUsers.map(user => ({
    Name: user.name,
    Email: user.email,
    'Registration Date': new Date(user.registrationDate).toLocaleDateString(),
    ...Object.entries(user.formResponses || {}).reduce((acc, [key, value]) => {
      if (key !== 'additionalInfo') {
        acc[value.question] = value.answer;
      }
      return acc;
    }, {}),
    [user.formResponses?.additionalInfo?.question || 'Additional Info']: 
      user.formResponses?.additionalInfo?.answer || ''
  }));

  // Calculate attendance data
  const totalAttendees = eventData.attendees?.length || 0;
  const attendancePercentage = totalRegistered > 0 
    ? Math.round((totalAttendees / totalRegistered) * 100) 
    : 0;
  const absentees = totalRegistered - totalAttendees;

  // Attendance pie chart data
  const attendanceChartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [totalAttendees, absentees],
      backgroundColor: ['#10B981', '#EF4444'], // Green for present, Red for absent
      borderColor: ['#059669', '#DC2626'],
      borderWidth: 1,
    }]
  };

  return (
    <div className="space-y-6">
      {/* Registration Analytics Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Registration Analytics</h2>
          </div>
          <button
            onClick={() => toggleSection('registration')}
            className="p-2 hover:bg-gray-50 rounded-full"
          >
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openSections.includes('registration') ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>

        {openSections.includes('registration') && (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="h-64">
                <Pie data={chartData} options={chartOptions} />
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Total Registered</p>
                  <p className="mt-1 text-2xl font-semibold text-indigo-600">
                    {totalRegistered} / {maxCapacity}
                  </p>
                  <p className="text-sm text-gray-500">
                    {registrationPercentage}% Capacity Used
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Available Spots</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {availableSpots}
                  </p>
                  <p className="text-sm text-gray-500">
                    Remaining Capacity
                  </p>
                </div>

                {/* Registration Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Registration Status</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {maxCapacity > 0 ? (
                      totalRegistered >= maxCapacity ? 
                        "✕ Registration Full" : 
                        "✓ Registration Open"
                    ) : (
                      "No capacity limit set"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Registered Users Section */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Registered Users</h3>
                <div className="flex gap-2">
                  {registeredUsers.length > 0 && (
                    <CSVLink
                      data={csvData}
                      filename={`${eventData.title}-registrations.csv`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </CSVLink>
                  )}
                  <button
                    onClick={fetchRegisteredUsers}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isLoading ? <div className='dots-loader' /> : 'Fetch Partipants'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {error}
                </div>
              )}

              {registeredUsers.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registeredUsers.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.formResponses?.name?.answer || user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.registrationDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                !isLoading && (
                  <p className="text-gray-500 text-center py-4">
                    Click "Fetch Users" to view registered participants
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Attendance Analytics Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Attendance Analytics</h2>
          </div>
          <button
            onClick={() => toggleSection('attendance')}
            className="p-2 hover:bg-gray-50 rounded-full"
          >
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openSections.includes('attendance') ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>

        {openSections.includes('attendance') && (
          <div className="p-6">
            {eventData.attendance?.isRequired ? (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Existing Attendance Analytics Content */}
                <div className="h-64">
                  <Pie data={attendanceChartData} options={chartOptions} />
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Attendance</p>
                    <p className="mt-1 text-2xl font-semibold text-green-600">
                      {totalAttendees} / {totalRegistered}
                    </p>
                    <p className="text-sm text-gray-500">
                      {attendancePercentage}% Attendance Rate
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Check-in Methods</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">QR Check-in</span>
                        <span className="text-sm font-medium">
                          {eventData.attendees?.filter(a => a.checkInMethod === 'qr').length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Manual Check-in</span>
                        <span className="text-sm font-medium">
                          {eventData.attendees?.filter(a => a.checkInMethod === 'manual').length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Attendance Status</p>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {totalAttendees === 0 ? (
                        "No attendees checked in yet"
                      ) : totalAttendees === totalRegistered ? (
                        "✓ All registered users attended"
                      ) : (
                        `${absentees} registered ${absentees === 1 ? 'user' : 'users'} absent`
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Users className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Attendance Required</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Attendance tracking is not enabled for this event
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}