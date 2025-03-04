import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import { toast } from 'react-hot-toast';
import HelpMenu from '../components/HelpMenu'; // Import HelpMenu component
import PlusMenu from '../components/PlusMenu'; // Import PlusMenu component

function Home() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false); // Add state for help menu
  const plusButtonRef = useRef(null);
  
  // Get events context
  const { 
    events, 
    isInitialLoading, 
    error, 
    loadMoreEvents,
    refreshEvents 
  } = useEvents();

  // Get current events based on active tab
  const currentEvents = events[activeTab]?.data || [];
  const isLoading = events[activeTab]?.loading || isInitialLoading;
  const hasMore = events[activeTab]?.hasMore || false;

  // Handle loading more events
  const handleLoadMore = async () => {
    try {
      await loadMoreEvents(activeTab);
    } catch (error) {
      toast.error('Failed to load more events');
    }
  };
  
  // Handle opening help menu
  const handleHelpClick = () => {
    setIsHelpMenuOpen(true);
    setIsPlusMenuOpen(false); // Close plus menu when help opens
  };
  
  // Handle closing help menu
  const handleHelpClose = () => {
    setIsHelpMenuOpen(false);
  };
  
  // Handle click outside of plus menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (plusButtonRef.current && !plusButtonRef.current.contains(event.target)) {
        setIsPlusMenuOpen(false);
      }
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Backdrop overlay */}
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
                      whitespace-nowrap py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-md
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
              {isLoading ? (
                // Loading skeletons
                [...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-4 h-80">
                    <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="mt-4 flex justify-between">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={refreshEvents}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <div 
                    key={event._id}
                    className="animate-fadeIn transform transition-all duration-300 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="text-gray-400 text-xl mb-4">No events found</div>
                  <p className="text-gray-500">
                    {activeTab === 'my' 
                      ? "You haven't registered for any events yet." 
                      : activeTab === 'upcoming' 
                      ? "There are no upcoming events at the moment." 
                      : "There are no past events to display."}
                  </p>
                </div>
              )}
            </div>
  
            {/* Load More Button */}
            {hasMore && !isLoading && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Load More
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
  
      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-50" ref={plusButtonRef}>
        <button
          onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
          className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center 
            text-white shadow-xl hover:bg-indigo-700 focus:outline-none transform hover:scale-110 
            transition-all duration-300"
        >
          <svg
            className={`h-8 w-8 transition-transform duration-300 ${
              isPlusMenuOpen ? 'rotate-45' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
  
        {/* Quick Actions Menu - Updated styling */}
        {isPlusMenuOpen && (
          <div className="absolute bottom-full right-0 mb-4 w-56 bg-white rounded-lg shadow-2xl py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
            </div>
            <div>
              <Link
                to="/certificates"
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-all duration-200"
              >
                <span className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-green-500 text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <span className="block font-medium capitalize">Certificates</span>
                  <span className="block text-xs text-gray-500 mt-0.5">View your certificates</span>
                </div>
              </Link>
              <Link
                to="/help"
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-all duration-200 w-full text-left"
              >
                <span className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-green-500 text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <span className="block font-medium capitalize">Help</span>
                  <span className="block text-xs text-gray-500 mt-0.5">Get support</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
  
      {/* Help Menu */}
      <HelpMenu isOpen={isHelpMenuOpen} onClose={handleHelpClose} />
    </div>
  );
}

export default Home;