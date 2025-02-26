import { createContext, useContext, useState, useCallback } from 'react';
import { fetchCsrfToken, addCsrfToken } from '../utils/csrf';

const EventsContext = createContext();

// Add useEvents hook
export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export function EventsProvider({ children }) {
  const [eventsData, setEventsData] = useState({
    upcoming: { events: [], total: 0, hasMore: false },
    past: { events: [], total: 0, hasMore: false },
    myEvents: { events: [], total: 0, hasMore: false }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Add function to check if data is stale (older than 1 minute)
  const isDataStale = useCallback(() => {
    if (!lastFetchTime) return true;
    const staleDuration = 60 * 1000; // 1 minute
    return Date.now() - lastFetchTime > staleDuration;
  }, [lastFetchTime]);

  const fetchAllEvents = useCallback(async (force = false) => {
    // If data is fresh and not forced, return early
    if (!force && !isDataStale()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/get-all-events`,
        {
          headers: addCsrfToken(),
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }

      setEventsData({
        upcoming: data.upcoming,
        past: data.past,
        myEvents: data.myEvents
      });
      setLastFetchTime(Date.now());
    } catch (error) {
      setError(error.message);
      console.error('Fetch events error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isDataStale]);

  // Function to load more events for a specific category
  const loadMore = async (category, page = 2, limit = 10) => {
    setIsLoading(true);
    try {
      await fetchCsrfToken();
      const endpoint = category === 'upcoming' ? '/events/all' :
                      category === 'past' ? '/events/get-past' :
                      '/events/my-events';

      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}${endpoint}?page=${page}&limit=${limit}`,
        {
          headers: addCsrfToken(),
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Update the specific category with new events
      setEventsData(prev => ({
        ...prev,
        [category]: {
          events: [...prev[category].events, ...data.events],
          total: data.pagination.totalEvents,
          hasMore: data.pagination.hasMore
        }
      }));

      return data.pagination;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetEvents = useCallback(() => {
    setEventsData({
      upcoming: { events: [], total: 0, hasMore: false },
      past: { events: [], total: 0, hasMore: false },
      myEvents: { events: [], total: 0, hasMore: false },
    });
    setLastFetchTime(null);
    setError(null);
  }, []);

  return (
    <EventsContext.Provider 
      value={{ 
        eventsData,
        isLoading, 
        error,
        fetchAllEvents,
        loadMore,
        isDataStale,
        resetEvents
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}