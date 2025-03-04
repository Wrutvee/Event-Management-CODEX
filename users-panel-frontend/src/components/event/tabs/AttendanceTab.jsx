import React from 'react';
import { CheckCircle, Users } from 'lucide-react';

function AttendanceTab({ event, isRegistered }) {
  if (!isRegistered) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Required</h3>
        <p className="text-gray-500">
          Please register for the event to access attendance features.
        </p>
      </div>
    );
  }

  // In a real app, this would show attendance status, QR code for check-in, etc.
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance</h3>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium text-green-800 mb-2">You're Registered!</h3>
        <p className="text-green-700 mb-4">
          You're all set to attend this event. Check back here on the day of the event for check-in options.
        </p>
        
        <div className="inline-flex items-center px-4 py-2 bg-white border border-green-300 rounded-lg text-green-700">
          <Users className="w-4 h-4 mr-2" />
          <span>Registered Attendees: {Math.floor(Math.random() * 100) + 50}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-800 mb-4">Event Check-in</h4>
        <p className="text-gray-600 mb-4">
          On the day of the event, a QR code will appear here that you can use to check in at the venue.
        </p>
        <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">QR code will appear here</span>
        </div>
      </div>
    </div>
  );
}

export default AttendanceTab;