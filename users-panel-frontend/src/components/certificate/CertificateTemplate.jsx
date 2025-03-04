import React from 'react';
import { format } from 'date-fns';

export default function CertificateTemplate({ 
  userName, 
  eventName, 
  issueDate, 
  certificateId, 
  issuer 
}) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="certificate-container w-full max-w-3xl mx-auto bg-white border-8 border-indigo-100 rounded-lg overflow-hidden shadow-xl">
      {/* Certificate Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-repeat" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Certificate Border */}
      <div className="relative p-8 md:p-12 text-center">
        {/* Certificate Header */}
        <div className="mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="h-20 w-20 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 9.75l4.5 4.5" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-indigo-600 mb-1">Certificate of Achievement</div>
          <div className="text-sm text-gray-500">This certifies that</div>
        </div>
        
        {/* Recipient Name */}
        <div className="my-8">
          <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 inline-block px-8">
            {userName || 'Participant Name'}
          </h2>
        </div>
        
        {/* Certificate Body */}
        <div className="my-8 text-lg text-gray-700">
          <p>has successfully completed</p>
          <p className="font-bold text-2xl my-4 text-gray-800">{eventName || 'Event Name'}</p>
          <p>organized by {issuer || 'Event Organizer'}</p>
          <p className="mt-4">on <span className="font-semibold">{formatDate(issueDate)}</span></p>
        </div>
        
        {/* Certificate Footer */}
        <div className="mt-12 flex justify-between items-end">
          <div className="text-left">
            <div className="w-40 border-b border-gray-400 mb-2"></div>
            <div className="text-sm text-gray-600">Date Issued</div>
            <div className="font-medium">{formatDate(issueDate)}</div>
          </div>
          
          <div className="text-center">
            <div className="mb-4">
              <img 
                src="/images/qr-code-placeholder.png" 
                alt="Certificate QR Code"
                className="h-20 w-20 mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3EQR Code%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="text-xs text-gray-500">Certificate ID: {certificateId || 'CERT-000000'}</div>
          </div>
          
          <div className="text-right">
            <div className="w-40 border-b border-gray-400 mb-2"></div>
            <div className="text-sm text-gray-600">Authorized Signature</div>
            <div className="font-medium">Event Director</div>
          </div>
        </div>
        
        {/* Certificate Seal */}
        <div className="absolute bottom-8 right-8">
          <div className="h-24 w-24 rounded-full border-4 border-indigo-600 flex items-center justify-center opacity-30">
            <div className="h-20 w-20 rounded-full border-2 border-indigo-300 flex items-center justify-center">
              <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}