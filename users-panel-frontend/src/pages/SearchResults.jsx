import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Calendar, MapPin, Clock, Filter, X } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: searchParams.get('dateRange') || 'all',
    eventType: searchParams.get('eventType') || 'all',
    isFree: searchParams.get('isFree') || 'all'
  });

  // Apply filters to search params
  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fix the API URL construction to match your .env configuration
        // Your .env has VITE_API_URL=http://localhost:3001/api
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        // No need to add /api again since it's already in the baseUrl
        const apiUrl = `${baseUrl}/events/search`;
        
        console.log('Searching with URL:', apiUrl);
        
        // Make sure we're using the correct parameter name (query) as expected by backend
        const params = {
          query: query.trim()
        };
        
        // Add filter parameters if they're set
        if (filters.dateRange !== 'all') params.dateRange = filters.dateRange;
        if (filters.eventType !== 'all') params.eventType = filters.eventType;
        if (filters.isFree !== 'all') params.isFree = filters.isFree;
        
        console.log('Search params:', params);
        
        // Add credentials to handle any potential auth requirements
        const response = await axios.get(apiUrl, { 
          params,
          withCredentials: true 
        });
        
        console.log('Search response:', response.data);
        
        // Check if the response has the expected structure
        if (response.data && response.data.success && Array.isArray(response.data.events)) {
          setResults(response.data.events);
        } else if (response.data && Array.isArray(response.data)) {
          // Handle case where API returns array directly
          setResults(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // Try to find events array in response
          const possibleResults = Object.values(response.data).find(val => Array.isArray(val));
          if (possibleResults) {
            setResults(possibleResults);
          } else {
            console.error('Could not find results array in response:', response.data);
            setResults([]);
            setError('Could not parse search results from server');
          }
        } else {
          console.error('Unexpected API response format:', response.data);
          setResults([]);
          setError('Received unexpected data format from server');
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        
        if (err.response) {
          setError(`Server error: ${err.response.data?.message || err.response.statusText || 'Unknown error'}`);
        } else if (err.request) {
          setError('No response received from server. Please check your connection.');
        } else {
          setError(`Error: ${err.message}`);
        }
        
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, filters.dateRange, filters.eventType, filters.isFree]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <div className="mb-8 flex flex-col items-center justify-center text-center w-full max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="mt-2 text-gray-600">
            {results.length} {results.length === 1 ? 'event' : 'events'} found
          </p>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="mt-4 flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters section - centered */}
      {showFilters && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 w-full max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                value={filters.eventType}
                onChange={(e) => handleFilterChange('eventType', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
                <option value="webinar">Webinar</option>
                <option value="networking">Networking</option>
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <select
                value={filters.isFree}
                onChange={(e) => handleFilterChange('isFree', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Prices</option>
                <option value="true">Free Only</option>
                <option value="false">Paid Only</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={applyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {results.length === 0 && !loading && !error ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search terms or browse all events.</p>
          <div className="mt-6">
            <Link
              to="/home"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse All Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={event.coverPhoto || event.mediaLinks?.[0] || '/images/event-placeholder.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/event-placeholder.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                
                {event.dateTime?.start && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      {new Date(event.dateTime.start).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {event.isFree ? 'Free' : event.price ? `$${event.price}` : 'Registration required'}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {event.duration || 'Duration not specified'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;