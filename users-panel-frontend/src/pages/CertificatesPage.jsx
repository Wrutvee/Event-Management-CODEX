import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Award, Search, Calendar, Filter, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import Header from '../components/Header';
import axiosInstance from '../services/axiosConfig';
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
  // Handle certificate download
  const handleDownloadCertificate = (certificate) => {
    // In a real application, this would trigger an API call to mark the certificate as downloaded
    // and initiate the download process
    
    // For now, we'll simulate the download by opening the certificate in a new tab
    const certificateUrl = `${window.location.origin}/certificates/${certificate.id}`;
    window.open(certificateUrl, '_blank');
    
    // Update the certificate status in our local state
    const updatedCertificates = certificates.map(cert => 
      cert.id === certificate.id ? { ...cert, status: 'downloaded' } : cert
    );
    setCertificates(updatedCertificates);
    
    // Also update filtered certificates
    const updatedFiltered = filteredCertificates.map(cert => 
      cert.id === certificate.id ? { ...cert, status: 'downloaded' } : cert
    );
    setFilteredCertificates(updatedFiltered);
  };
  // Handle certificate view
  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };
  // Handle modal close
  const handleCloseModal = () => {
    setShowCertificateModal(false);
  };
  // Handle filter change
  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
  };
  // Mock data for certificates - replace with actual API call in production
  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      try {
        // In production, replace with actual API call
        // const response = await axiosInstance.get('/certificates');
        // setCertificates(response.data);
        
        // Mock data for development
        const mockCertificates = [
          {
            id: 'cert-001',
            eventId: 'event-001',
            eventName: 'Web Development Bootcamp',
            issueDate: '2023-05-15T10:00:00Z',
            category: 'Technical',
            issuer: 'EventHub Academy',
            certificateUrl: '#',
            status: 'issued'
          },
          {
            id: 'cert-002',
            eventId: 'event-002',
            eventName: 'Leadership Summit 2023',
            issueDate: '2023-06-22T14:30:00Z',
            category: 'Professional Development',
            issuer: 'EventHub Leadership Institute',
            certificateUrl: '#',
            status: 'issued'
          },
          {
            id: 'cert-003',
            eventId: 'event-003',
            eventName: 'Data Science Conference',
            issueDate: '2023-07-10T09:15:00Z',
            category: 'Technical',
            issuer: 'EventHub Tech',
            certificateUrl: '#',
            status: 'issued'
          },
          {
            id: 'cert-004',
            eventId: 'event-004',
            eventName: 'Digital Marketing Masterclass',
            issueDate: '2023-08-05T13:00:00Z',
            category: 'Marketing',
            issuer: 'EventHub Business School',
            certificateUrl: '#',
            status: 'pending'
          }
        ];
        
        setTimeout(() => {
          setCertificates(mockCertificates);
          setFilteredCertificates(mockCertificates);
          setIsLoading(false);
        }, 1000); // Simulate network delay
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCertificates();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  // Filter certificates based on search query and filter type
  useEffect(() => {
    let filtered = certificates;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(cert => 
        cert.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(cert => cert.status === filterType);
    }
    
    setFilteredCertificates(filtered);
  }, [searchQuery, filterType, certificates]);
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Certificates</h1>
          <p className="mt-2 text-gray-600">View and download certificates for events you've attended</p>
        </div>
        
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterType === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('downloaded')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterType === 'downloaded' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Downloaded
            </button>
            <button
              onClick={() => handleFilterChange('not-downloaded')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterType === 'not-downloaded' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Not Downloaded
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Certificates</option>
                <option value="issued">Issued</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
        {/* Certificates List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterType !== 'all' 
                ? "No certificates match your search criteria. Try adjusting your filters."
                : "You don't have any certificates yet. Attend events to earn certificates!"}
            </p>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <div 
                key={certificate.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Award className="h-6 w-6 text-indigo-600 mr-2" />
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                        {certificate.category}
                      </span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      certificate.status === 'issued' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {certificate.status === 'issued' ? 'Issued' : 'Pending'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{certificate.eventName}</h3>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Issued: {formatDate(certificate.issueDate)}</span>
                    </div>
                    <div>Issuer: {certificate.issuer}</div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleViewCertificate(certificate)}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                    
                    <button
                      onClick={() => handleDownloadCertificate(certificate)}
                      disabled={certificate.status !== 'issued'}
                      className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                        certificate.status === 'issued'
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Certificate Modal */}
      {showCertificateModal && selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          user={user}
          onClose={() => setShowCertificateModal(false)}
          onDownload={() => handleDownloadCertificate(selectedCertificate)}
        />
      )}
    </div>
  );
}