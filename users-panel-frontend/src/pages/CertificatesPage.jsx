import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Award, Search, Calendar, Filter, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import Header from '../components/Header';
import CertificateModal from '../components/certificate/CertificateModal';

export default function CertificatesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useEvents();
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Process certificates from user's registered events
  useEffect(() => {
    if (!user || !events) return;

    const processedCertificates = user.registeredEvents
      .filter(regEvent => {
        // Find the corresponding event
        const event = [...events.upcoming.data, ...events.past.data, ...events.my.data]
          .find(e => e._id === regEvent.eventId);
        
        // Only include events that provide certificates and user has attended
        return event?.certificates?.willItBeProvided && regEvent.attendance?.isAttended;
      })
      .map(regEvent => {
        const event = [...events.upcoming.data, ...events.past.data, ...events.my.data]
          .find(e => e._id === regEvent.eventId);

        return {
          id: regEvent._id,
          eventId: regEvent.eventId,
          eventName: event.title,
          issueDate: regEvent.attendance?.checkinTime || event.dateTime.end,
          category: event.category,
          issuer: event.organizer.name,
          certificateUrl: regEvent.certificateUrl,
          status: regEvent.certificateUrl ? 'issued' : 'pending'
        };
      });

    setCertificates(processedCertificates);
    setFilteredCertificates(processedCertificates);
    setIsLoading(false);
  }, [user, events]);

  // Handle certificate download
  const handleDownloadCertificate = (certificate) => {
    window.open(certificate.certificateUrl, '_blank');
  };

  // Handle certificate view
  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  // Filter certificates based on search and filter type
  useEffect(() => {
    if (!certificates) return;

    let filtered = [...certificates];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cert => 
        cert.eventName.toLowerCase().includes(query) ||
        cert.category.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query)
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(cert => cert.status === filterType);
    }

    setFilteredCertificates(filtered);
  }, [searchQuery, filterType, certificates]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Date not available';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Award className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              {['all', 'issued', 'pending'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg ${
                    filterType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {certificate.eventName}
                    </h3>
                    <p className="text-sm text-gray-500">{certificate.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      certificate.status === 'issued'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {certificate.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(certificate.issueDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Issued by: {certificate.issuer}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {certificate.status === 'issued' && (
                    <>
                      <button
                        onClick={() => handleDownloadCertificate(certificate)}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                      <button
                        onClick={() => handleViewCertificate(certificate)}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No certificates found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery
                ? "No certificates match your search criteria"
                : "You don't have any certificates yet"}
            </p>
          </div>
        )}
      </div>

      {/* Certificate View Modal */}
      {showCertificateModal && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
}