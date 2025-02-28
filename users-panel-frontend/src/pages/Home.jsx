import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

function Home() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const plusButtonRef = useRef(null);
  
  // Sample event data categorized by type
  const eventsByType = {
    my: [
      {
        id: 1,
        title: 'My Tech Workshop',
        description: 'Workshop on React Development',
        date: '2024-03-10',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        isRegistered: true
      },
      {
        id: 2,
        title: 'Local Meetup',
        description: 'Monthly Developer Meetup',
        date: '2024-03-20',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
        isRegistered: true
      }
    ],
    upcoming: [
      {
        id: 3,
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest tech conference',
        date: '2024-04-15',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        isRegistered: false
      },
      {
        id: 4,
        title: 'Music Festival',
        description: 'Experience amazing live performances',
        date: '2024-04-01',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
        isRegistered: false
      }
    ],
    past: [
      {
        id: 5,
        title: 'Code Summit 2023',
        description: 'Past coding conference',
        date: '2023-12-15',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        isRegistered: true
      },
      {
        id: 6,
        title: 'Winter Hackathon',
        description: 'Previous hackathon event',
        date: '2023-11-30',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
        isRegistered: true
      }
    ]
  };

  // Get events based on active tab
  const currentEvents = eventsByType[activeTab] || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (plusButtonRef.current && !plusButtonRef.current.contains(event.target)) {
        setIsPlusMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Add backdrop overlay when menu is open */}
      {isPlusMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-200 z-40"
          onClick={() => setIsPlusMenuOpen(false)}
        />
      )}

      <Header />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col gap-6">
          <main className="flex-1">
            {/* Header Section */}
            <div className="mb-4 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 animate-slideDown">
                {activeTab === 'my' ? 'My Events' :
                 activeTab === 'upcoming' ? 'Upcoming Events' :
                 'Past Events'}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 animate-slideUp">
                {activeTab === 'my' ? 'Events you are registered for' :
                 activeTab === 'upcoming' ? 'Discover and join amazing events' :
                 'Previous events'}
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-6 sm:mb-8">
              <nav className="flex space-x-4 sm:space-x-8">
                {['my', 'upcoming', 'past'].map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      whitespace-nowrap py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold rounde  d-md
                      transition-all duration-300 transform hover:scale-105
                      ${activeTab === tab 
                        ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                      }
                      focus:outline-none active:outline-none
                    `}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
                  </button>
                ))}
              </nav>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="animate-fadeIn transform transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      <div 
        className="fixed bottom-6 right-6 z-50 animate-float" 
        ref={plusButtonRef}
      >
        <button
          onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center 
          text-white shadow-xl hover:bg-indigo-700 focus:outline-none transition-all duration-300 
          transform hover:scale-110"
        >
          <svg
            className={`h-8 w-8 sm:h-10 sm:w-10 transition-transform duration-300 ${
              isPlusMenuOpen ? 'rotate-45' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5} // Made the stroke thicker
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>

        {/* Floating Menu */}
        {isPlusMenuOpen && (
          <div className="absolute bottom-full right-0 mb-4 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
            {['certificates', 'help'].map((item) => (
              <Link
                key={item}
                to={`/${item}`}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 
                  transition-all duration-150 capitalize transform hover:translate-x-2"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;