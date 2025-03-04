import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useEvents } from '../context/EventContext';
import Header from '../components/Header';
import EventTabs from '../components/event/EventTabs';
import MediaCarousel from "../components/event/MediaCarousel";
import axiosInstance from '../services/axiosConfig';

export default function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, isInitialLoading, fetchAllEvents, getEventById } = useEvents();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      // Try to find event in context first
      const contextEvent = events.upcoming.data.find(e => e._id === eventId) || 
                          events.past.data.find(e => e._id === eventId) || 
                          events.my.data.find(e => e._id === eventId);

      if (contextEvent) {
        setEvent(contextEvent);
        setLoading(false);
        return;
      }

      // If not in context and not already loading events, try to get by ID
      if (!isInitialLoading) {
        try {
          const fetchedEvent = await getEventById(eventId);
          if (fetchedEvent) {
            setEvent(fetchedEvent);
          }
        } catch (error) {
          console.error('Error fetching event:', error);
          toast.error('Failed to load event details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [eventId, events, isInitialLoading, getEventById]);

  // Handle registration
  const handleRegister = async () => {
    try {
      setRegistering(true);
      const response = await axiosInstance.post(`/events/${eventId}/register`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      // Refresh events data after successful registration
      await fetchAllEvents();
      toast.success('Successfully registered for the event!');
    } catch (error) {
      toast.error(error.message || 'Failed to register for the event');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy • h:mm a');
    } catch (error) {
      return 'Date to be announced';
    }
  };

  if (isInitialLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEventFull = event.capacity.required && 
    event.registeredUsers.length >= event.capacity.maxParticipants;

  const isRegistrationOpen = event.registration.isRequired ? 
    new Date() < new Date(event.registration.deadline) : true;

  const isRegistered = event.registeredUsers?.includes(event.userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Header />
      
      <MediaCarousel 
        mediaLinks={event.mediaLinks}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {event.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{formatDate(event.dateTime.start)}</span>
              <span>•</span>
              <span>
                {event.venue.type === "online" ? "Virtual Event" : event.venue.details}
              </span>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={isRegistered || registering || isEventFull || !isRegistrationOpen}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white shadow-md
              transition-all duration-200 transform hover:scale-105 active:scale-95
              ${isRegistered ? 'bg-green-600 cursor-default' :
                isEventFull ? 'bg-red-600 cursor-not-allowed' :
                !isRegistrationOpen ? 'bg-gray-600 cursor-not-allowed' :
                'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {registering ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : isRegistered ? 'Registered' :
              isEventFull ? 'Event Full' :
              !isRegistrationOpen ? 'Registration Closed' :
              'Register Now'}
          </button>
        </div>

        <EventTabs 
          event={event}
          isRegistered={isRegistered}
        />
      </div>
    </div>
  );
}