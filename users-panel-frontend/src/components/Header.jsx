import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEventHubOpen, setIsEventHubOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, logout } = useAuth();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const eventHubRef = useRef(null);
  const navigate = useNavigate();

  const handleEventHubClick = () => {
    navigate('/super-admin/announcements');
  };

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle notification click based on device
  const handleNotificationClick = () => {
    if (isMobile) {
      navigate('/notifications');
    } else {
      setIsNotificationsOpen(!isNotificationsOpen);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      // Handle notification dropdown
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      
      // Handle profile dropdown
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      // Handle eventHub dropdown
      if (eventHubRef.current && !eventHubRef.current.contains(event.target)) {
        setIsEventHubOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Backdrop overlay */}
      {(isNotificationsOpen || isProfileOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-200 z-40"
          onClick={() => {
            setIsNotificationsOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}

      <header className="bg-white shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* EventHub Company Logo Text */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                <span className="text-indigo-600">Event</span>
                <span className="text-gray-900">Hub</span>
              </span>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={handleNotificationClick}
                  className={`
                    p-2.5 rounded-full text-gray-600 transition-all duration-200 focus:outline-none
                    ${
                      isNotificationsOpen
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }
                  `}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>

                {/* Desktop Notification Dropdown */}
                {!isMobile && isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {/* Sample notifications */}
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <p className="text-sm text-gray-600">
                          New event has been added
                        </p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Log in
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`
                  flex items-center rounded-full transition-all duration-300
                  ${
                    isProfileOpen
                      ? "transform scale-105 ring-2 ring-indigo-500"
                      : "hover:scale-105"
                  }
                  focus:outline-none w-10 h-10 justify-center overflow-hidden
                `}
                  style={{
                    background: `url('/images/740ecb78aa4c10cb0a2170ea2350c337.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-indigo-500">
                          <img
                            className="h-full w-full object-cover"
                            src="/images/740ecb78aa4c10cb0a2170ea2350c337.jpg"
                            alt="Profile"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {user?.name || "John Doe"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email || "john@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Your Profile
                      </Link>
                      <Link
                        to="/calendar"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Event Calendar
                      </Link>
                      <Link
                        to="/login"
                        onClick={logout}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24" // Fixed the viewBox value
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;