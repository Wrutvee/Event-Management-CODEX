import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function EventCard({ event }) {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };
  
  // Get the appropriate date from the event object
  const eventDate = event.dateTime?.start || event.date || event.eventDate;
  const formattedDate = formatDate(eventDate);
  
  // Handle different image formats
  const imageUrl = event.coverPhoto || event.image || event.eventImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
  
  // Get event status
  const getEventStatus = () => {
    if (event.isRegistered) return 'Registered';
    if (event.isFull) return 'Full';
    return 'Open';
  };
  // Format location properly
  const getLocationString = () => {
    // Handle string locations
    if (typeof event.location === 'string') return event.location;
    if (typeof event.venue === 'string') return event.venue;
    
    // Handle venue object with better error checking
    if (event.venue && typeof event.venue === 'object') {
      try {
        if (event.venue.details) return event.venue.details;
        if (event.venue.type) {
          return event.venue.type === 'online' 
            ? 'Online Event' 
            : event.venue.type === 'hybrid'
              ? 'Hybrid Event'
              : 'In-Person Event';
        }
        if (event.venue.address) return event.venue.address;
      } catch (error) {
        console.error('Error parsing venue object:', error);
      }
    }
    
    // Handle organizer location as fallback
    if (event.organizer && event.organizer.location) {
      return event.organizer.location;
    }
    
    return 'Location TBD';
  };
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={event.title || event.name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
          }}
        />
        <div className="absolute top-0 right-0 m-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            event.isRegistered ? 'bg-green-100 text-green-800' : 
            'bg-indigo-100 text-indigo-800'
          }`}>
            {getEventStatus()}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {event.title || event.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {event.description || event.eventDescription || 'No description available'}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-indigo-600">
              {getLocationString()}
            </span>
            
            <Link 
              to={`/event/${event._id || event.id}`}
              className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;