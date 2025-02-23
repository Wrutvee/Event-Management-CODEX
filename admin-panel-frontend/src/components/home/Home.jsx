import { useState } from 'react';
import Navbar from './components/Navbar';
import EventsHeader from './components/EventsHeader';
import EventsGrid from './components/EventsGrid';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [activeView, setActiveView] = useState('My Events');
  const navigate = useNavigate();

  // Mock data - you can move this to a separate file later
  const events = [
    { id: 1, title: 'Tech Conference 2023', date: 'Oct 15-20, 2023', registrations: 245, status: 'My Events' },
    { id: 2, title: 'Web Dev Workshop', date: 'Nov 1-2, 2023', registrations: 89, status: 'Upcoming' },
    { id: 3, title: 'UX Design Summit', date: 'Sep 5-7, 2023', registrations: 156, status: 'Past' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsHeader activeView={activeView} setActiveView={setActiveView} />
        <EventsGrid events={events.filter(event => event.status === activeView)} />
        
        {/* Mobile FAB */}
        <button
         onClick={()=> navigate('/events/create')}
         className="md:hidden fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>
    </div>
  );
}