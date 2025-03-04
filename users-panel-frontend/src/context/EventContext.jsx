import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../services/axiosConfig';

const EventContext = createContext(null);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState({
    my: { data: [], total: 0, hasMore: false, page: 1, loading: false },
    upcoming: { data: [], total: 0, hasMore: false, page: 1, loading: false },
    past: { data: [], total: 0, hasMore: false, page: 1, loading: false }
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all events initially
  const fetchAllEvents = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      setError(null);

      const response = await axiosInstance.get('/events/all');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch events');
      }

      const { my, upcoming, past } = response.data;

      setEvents({
        my: {
          data: my.events || [],
          total: my.total || 0,
          hasMore: my.hasMore || false,
          page: 1,
          loading: false
        },
        upcoming: {
          data: upcoming.events || [],
          total: upcoming.total || 0,
          hasMore: upcoming.hasMore || false,
          page: 1,
          loading: false
        },
        past: {
          data: past.events || [],
          total: past.total || 0,
          hasMore: past.hasMore || false,
          page: 1,
          loading: false
        }
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message || 'Failed to load events');
      toast.error(error.message || 'Failed to load events');
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Load more events for a specific category
  const loadMoreEvents = async (category) => {
    if (events[category].loading || !events[category].hasMore) return;

    setEvents(prev => ({
      ...prev,
      [category]: { ...prev[category], loading: true }
    }));

    try {
      const nextPage = events[category].page + 1;
      const response = await axiosInstance.get(`/events/${category}`, {
        params: { page: nextPage, limit: 10 }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || `Failed to load more ${category} events`);
      }

      const { events: newEvents, pagination } = response.data;

      setEvents(prev => ({
        ...prev,
        [category]: {
          data: [...prev[category].data, ...newEvents],
          total: pagination.totalEvents,
          hasMore: pagination.hasMore,
          page: nextPage,
          loading: false
        }
      }));
    } catch (error) {
      console.error(`Error loading more ${category} events:`, error);
      toast.error(error.message || `Failed to load more ${category} events`);
      setEvents(prev => ({
        ...prev,
        [category]: { ...prev[category], loading: false }
      }));
    }
  };

  // Get event by ID
  const getEventById = async (eventId) => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch event');
      }

      return response.data.event;
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error(error.message || 'Failed to load event details');
      return null;
    }
  };

  // Register for event
  const registerForEvent = async (eventId, registrationData) => {
    try {
      const response = await axiosInstance.post(`/events/${eventId}/register`, registrationData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      // Update local state to reflect registration
      setEvents(prev => ({
        ...prev,
        upcoming: {
          ...prev.upcoming,
          data: prev.upcoming.data.map(event => 
            event._id === eventId ? { ...event, isRegistered: true } : event
          )
        },
        my: {
          ...prev.my,
          data: [...prev.my.data, response.data.event]
        }
      }));

      toast.success('Successfully registered for the event!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register for event');
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  return (
    <EventContext.Provider value={{
      events,
      isInitialLoading,
      error,
      loadMoreEvents,
      getEventById,
      registerForEvent,
      refreshEvents: fetchAllEvents
    }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;