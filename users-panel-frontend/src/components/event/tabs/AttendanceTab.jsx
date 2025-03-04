import React from 'react';
import { CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import QRCode from 'react-qr-code';

function AttendanceTab({ event, isRegistered }) {
  const { user } = useAuth();

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

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${event.title}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const isEventDay = () => {
    const today = new Date();
    const eventDate = new Date(event.dateTime.start);
    return today.toDateString() === eventDate.toDateString();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance</h3>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium text-green-800 mb-2">
          You're Registered!
        </h3>
        <p className="text-green-700 mb-4">
          {isEventDay()
            ? "It's event day! Use the QR code below to check in."
            : "You're all set to attend this event. Check back here on the day of the event for check-in options."}
        </p>
      </div>

      {!event.attendance.isRequired && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <h4 className="font-medium text-gray-800 mb-2">Attendance Not Required</h4>
            <p className="text-sm text-gray-500">
              Attendance for this event is not required. Enjoy the event!
            </p>
          </div>
        </div>
      )}

      {event.attendance.qrCheckin && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <h4 className="font-medium text-gray-800 mb-2">
              Event Check-in QR Code
            </h4>
            <p className="text-sm text-gray-500">
              Show this QR code to the event organizer to mark your attendance
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <QRCode
                id="qr-code"
                value={user.id}
                level="H"
                size={200}
                className="mx-auto"
              />
            </div>

            <button
              onClick={downloadQRCode}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </button>

            <div className="text-sm text-gray-500 text-center">
              <p>Event: {event.title}</p>
              <p>Date: {new Date(event.dateTime.start).toLocaleDateString()}</p>
              <p>Time: {new Date(event.dateTime.start).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      )}

      {event.attendance.manualCheckin && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h4 className="font-medium text-gray-800 mb-2">
            Manual Check-in
          </h4>
          <p className="text-gray-500">
            Give the code below to the event organizer to mark your attendance
          </p>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <code className="font-mono text-sm">{user.id}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceTab;