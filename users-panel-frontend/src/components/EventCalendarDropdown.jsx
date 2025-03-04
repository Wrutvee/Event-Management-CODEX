import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'react-calendar';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import axiosInstance from '../services/axiosConfig';
import 'react-calendar/dist/Calendar.css';

function EventCalendarDropdown({ isOpen, onClose }) {
  const [eventDates, setEventDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsForDate, setEventsForDate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = useRef(null);
  const navigate = useNavigate();
  const { events } = useEvents();

  // Extract event dates from events context
  useEffect(() => {
    const dates = {};
    
    // Process upcoming events
    if (events.upcoming && events.upcoming.data) {
      events.upcoming.data.forEach(event => {
        if (event.dateTime && event.dateTime.start) {
          const dateKey = format(new Date(event.dateTime.start), 'yyyy-MM-dd');
          if (!dates[dateKey]) {
            dates[dateKey] = [];
          }
          dates[dateKey].push(event);
        }
      });
    }
    
    // Process past events
    if (events.past && events.past.data) {
      events.past.data.forEach(event => {
        if (event.dateTime && event.dateTime.start) {
          const dateKey = format(new Date(event.dateTime.start), 'yyyy-MM-dd');
          if (!dates[dateKey]) {
            dates[dateKey] = [];
          }
          dates[dateKey].push(event);
        }
      });
    }
    
    // Process my events
    if (events.my && events.my.data) {
      events.my.data.forEach(event => {
        if (event.dateTime && event.dateTime.start) {
          const dateKey = format(new Date(event.dateTime.start), 'yyyy-MM-dd');
          if (!dates[dateKey]) {
            dates[dateKey] = [];
          }
          dates[dateKey].push(event);
        }
      });
    }
    
    setEventDates(dates);
  }, [events]);

  // Handle date click
  const handleDateClick = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    
    if (eventDates[dateKey] && eventDates[dateKey].length > 0) {
      setEventsForDate(eventDates[dateKey]);
    } else {
      setEventsForDate([]);
    }
  };

  // Navigate to event details
  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
    onClose();
  };

  // Custom tile content to mark dates with events
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = format(date, 'yyyy-MM-dd');
      if (eventDates[dateKey] && eventDates[dateKey].length > 0) {
        return (
          <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full mx-auto mt-1"></div>
        );
      }
    }
    return null;
  };

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Format time for display
  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={onClose} />
      )}
      
      <div 
        ref={calendarRef}
        className={`absolute right-0 mt-2 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 transform origin-top-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{ width: '340px' }}
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">Event Calendar</h3>
        </div>
        
        <div className="p-4">
          <Calendar 
            onChange={handleDateClick}
            value={selectedDate || new Date()}
            tileContent={tileContent}
            className="border-0"
          />
        </div>
        
        {selectedDate && eventsForDate.length > 0 && (
          <div className="p-4 border-t border-gray-100 max-h-60 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Events on {format(selectedDate, 'MMMM d, yyyy')}
            </h4>
            <div className="space-y-3">
              {eventsForDate.map(event => (
                <div 
                  key={event._id} 
                  className="p-3 bg-gray-50 rounded-md hover:bg-indigo-50 cursor-pointer transition-colors"
                  onClick={() => handleEventClick(event._id)}
                >
                  <h5 className="text-sm font-medium text-gray-900">{event.title}</h5>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(event.dateTime.start)} - {formatTime(event.dateTime.end)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.venue?.type === 'online' 
                      ? 'Online Event' 
                      : event.venue?.details || 'Location not specified'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedDate && eventsForDate.length === 0 && (
          <div className="p-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              No events on {format(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default EventCalendarDropdown;