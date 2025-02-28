import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
import Navbar from '../../components/navbar/Navbar';
import EventsHeader from '../../layout/home/EventsHeader';
import EventsGrid from '../../layout/home/EventsGrid';
import PageLoader from '../../components/common/PageLoader';

export default function Home() {
  const [activeView, setActiveView] = useState('My Events');
  const navigate = useNavigate();
  const { eventsData, isLoading, error, fetchAllEvents, isDataStale } = useEvents();

  // Initial fetch on mount or when data is stale
  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Background refresh when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isDataStale()) {
        fetchAllEvents(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchAllEvents, isDataStale]);

  // Get the correct events array based on active view with safe access
  const getCurrentEvents = useCallback(() => {
    if (!eventsData) return [];
    
    switch (activeView) {
      case 'My Events':
        return eventsData.myEvents?.events || [];
      case 'Upcoming':
        return eventsData.upcoming?.events || [];
      case 'Past':
        return eventsData.past?.events || [];
      default:
        return [];
    }
  }, [eventsData, activeView]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsHeader activeView={activeView} setActiveView={setActiveView} />
        
        <EventsGrid 
          events={getCurrentEvents()} 
          isLoading={isLoading}
          error={error}
        />
        
        {/* Mobile FAB */}
        <button
          onClick={() => navigate('/events/create')}
          className="md:hidden fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>
    </div>
  );
}