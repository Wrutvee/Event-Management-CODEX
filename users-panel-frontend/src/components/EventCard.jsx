import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function EventCard({ event }) {
  const navigate = useNavigate();
  
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
  
  // Handle card click to navigate to event details
  const handleCardClick = () => {
    navigate(`/events/${event._id || event.id}`);
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
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
          <span className={`
            inline-block px-2 py-1 text-xs font-semibold rounded-full
            ${getEventStatus() === 'Registered' ? 'bg-green-100 text-green-800' : 
              getEventStatus() === 'Full' ? 'bg-red-100 text-red-800' : 
              'bg-blue-100 text-blue-800'}
          `}>
            {getEventStatus()}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title || event.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{getLocationString()}</p>
        <p className="text-sm text-gray-700 mb-4">{formattedDate}</p>
        
        <div className="mt-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
            <span>{event.category || 'Event'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;