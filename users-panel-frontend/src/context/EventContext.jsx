import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../services/axiosConfig';

// Create the context
const EventContext = createContext();

// Custom hook to use the event context
export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

// Provider component
export const EventProvider = ({ children }) => {  // Changed from EventsProvider to EventProvider
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch events from admin backend
      const response = await axiosInstance.get('http://localhost:3000/api/events/get-all-events', {
        withCredentials: true
      });

      if (response.data.success) {
        const allEvents = [...response.data.upcoming.events, ...response.data.past.events];
        const now = new Date();

        setEvents(allEvents);
        // Featured events are upcoming events marked as featured
        setFeaturedEvents(response.data.upcoming.events.filter(event => event.isFeatured));
        setUpcomingEvents(response.data.upcoming.events);
        setPastEvents(response.data.past.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single event by ID
  const fetchEventById = async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`http://localhost:3000/api/events/${eventId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        return response.data.event;
      }
      return null;
    } catch (error) {
      console.error('Error fetching event:', error);
      setError(error.message);
      toast.error('Failed to load event details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Register for an event
  const registerForEvent = async (eventId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/events/${eventId}/register`);
      
      if (response.data.success) {
        // Update the events state to reflect registration
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event._id === eventId ? { ...event, isRegistered: true } : event
          )
        );
        toast.success('Successfully registered for the event!');
        return true;
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error(error.response?.data?.message || 'Failed to register for the event');
      return false;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);
  const value = {
    events,
    featuredEvents,
    upcomingEvents,
    pastEvents,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    registerForEvent
  };
  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;