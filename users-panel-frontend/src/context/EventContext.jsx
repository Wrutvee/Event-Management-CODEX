import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import { toast } from 'react-hot-toast';

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

  // Fetch all events initially (10 of each type)
  const fetchAllEvents = useCallback(async () => {
    setIsInitialLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get('/events/all');
      const { success, my, upcoming, past, message } = response.data;

      if (!success) {
        throw new Error(message || 'Failed to fetch events');
      }
      
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
      console.error('Error fetching all events:', error);
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
      [category]: {
        ...prev[category],
        loading: true
      }
    }));
    
    try {
      const nextPage = events[category].page + 1;
      const response = await axiosInstance.get(`/events/${category}`, {
        params: { page: nextPage, limit: 10 }
      });
      
      const { success, events: newEvents, pagination, message } = response.data;

      if (!success) {
        throw new Error(message || `Failed to load more ${category} events`);
      }
      
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
        [category]: {
          ...prev[category],
          loading: false
        }
      }));
    }
  };

  // Fetch all events on initial load
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  return (
    <EventContext.Provider value={{
      events,
      isInitialLoading,
      error,
      loadMoreEvents,
      refreshEvents: fetchAllEvents
    }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;