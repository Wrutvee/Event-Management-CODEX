import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Filter } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import LoadingScreen from '../components/LoadingScreen';
import EventCard from '../components/EventCard';
import Fuse from 'fuse.js';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const { events, isInitialLoading } = useEvents();
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Combine all events from different categories
  const allEvents = useMemo(() => {
    const combinedEvents = [
      ...events.upcoming.data,
      ...events.past.data,
      ...events.my.data
    ];
    
    // Remove duplicates based on event ID
    return Array.from(new Map(combinedEvents.map(event => [event._id, event])).values());
  }, [events]);

  // Initialize Fuse instance with proper options
  const fuse = useMemo(() => {
    return new Fuse(allEvents, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'category', weight: 1.5 },
        { name: 'tags', weight: 1.5 },
        { name: 'organizer.name', weight: 1 },
        { name: 'venue.details', weight: 0.5 }
      ],
      threshold: 0.4,
      includeScore: true
    });
  }, [allEvents]);

  // Get search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results = fuse.search(query);
    let filteredResults = results.map(result => result.item);

    // Apply additional filters
    if (filterType !== 'all') {
      filteredResults = filteredResults.filter(event => {
        switch (filterType) {
          case 'upcoming':
            return new Date(event.dateTime.start) > new Date();
          case 'past':
            return new Date(event.dateTime.end) < new Date();
          case 'free':
            return event.registration.fee === 0;
          default:
            return true;
        }
      });
    }

    return filteredResults;
  }, [query, fuse, filterType]);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="mt-2 text-gray-600">
            Found {searchResults.length} events
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>

          {showFilters && (
            <div className="mt-4 flex gap-4">
              {['all', 'upcoming', 'past', 'free'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filterType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search terms or browse all events.
            </p>
            <div className="mt-6">
              <Link
                to="/home"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse All Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}