import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Download, Award, AlertCircle } from 'lucide-react';

export default function CertificateTab({ event, isRegistered }) {
  const { user } = useAuth();

  // Find the registered event entry for the current event
  const registeredEvent = user?.registeredEvents?.find(
    (regEvent) => regEvent.eventId === event
  );

  // Check if certificate is available
  const certificateUrl = registeredEvent?.certificateUrl;
  const hasAttended = registeredEvent?.attendance?.isAttended;

  if (!isRegistered) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Registration Required
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Please register for the event to access your certificate.
        </p>
      </div>
    );
  }

  if (!hasAttended) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
        <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Attendance Required
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          You need to attend the event to receive your certificate.
        </p>
      </div>
    );
  }

  if (!certificateUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Certificate Not Available
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Your certificate will be available here once it's generated.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
        <Award className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Certificate Available!
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        Congratulations! Your certificate for this event is ready to download.
      </p>
      <a
        href={certificateUrl}
        download
        target='_blank'
        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <Download className="w-5 h-5 mr-2" />
        Download Certificate
      </a>
    </div>
  );
}