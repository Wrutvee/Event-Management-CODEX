import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
import Navbar from './components/Navbar';
import EventsHeader from './components/EventsHeader';
import EventsGrid from './components/EventsGrid';

export default function Home() {
  const [activeView, setActiveView] = useState('My Events');
  const navigate = useNavigate();
  const { eventsData, isLoading, error, fetchAllEvents } = useEvents();

  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Get the correct events array based on active view with safe access
  const getCurrentEvents = () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsHeader activeView={activeView} setActiveView={setActiveView} />
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="dots-loader" />
          </div>
        )}

        {error && (
          <div className="text-red-600 text-center py-12">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <EventsGrid events={getCurrentEvents()} />
        )}
        
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