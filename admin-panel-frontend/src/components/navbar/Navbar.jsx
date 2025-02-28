import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import ProfileDropdown from './ProfileDropdown';
import HamburgerButton from './HamburgerButton';
import PageLoader from '../common/PageLoader';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    setIsNavigating(true);
    navigate('/events/create');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center">
              <HamburgerButton
                isOpen={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />

              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-7 md:h-8 w-auto"
                  src="/logos/main_logo.png"
                  alt="Logo"
                />
                <span className="ml-2 text-lg md:text-xl font-bold text-gray-800">
                  EventHub
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center md:space-x-2 lg:space-x-4">
              <Link
                to="/home"
                className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                  isActive("/home")
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                <svg
                  className={`mr-1.5 lg:mr-2 h-4 lg:h-5 w-4 lg:w-5 ${
                    isActive("/home") ? "text-indigo-600" : "text-gray-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Events
              </Link>
              <Link
                to="/analytics"
                className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                  isActive("/analytics")
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                <svg
                  className={`mr-1.5 lg:mr-2 h-4 lg:h-5 w-4 lg:w-5 ${
                    isActive("/analytics") ? "text-indigo-600" : "text-gray-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics
              </Link>
              <Link
                to="/resources"
                className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                  isActive("/resources")
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                <svg
                  className={`mr-1.5 lg:mr-2 h-4 lg:h-5 w-4 lg:w-5 ${
                    isActive("/resources") ? "text-indigo-600" : "text-gray-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Resources
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center md:space-x-2 lg:space-x-4">
              <button
                onClick={handleClick}
                disabled={isNavigating}
                className="hidden md:inline-flex items-center px-2 lg:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs lg:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75"
              >
                {isNavigating ? (
                  <div>
                    <PageLoader />
                  </div>
                ) : (
                  <>
                    <svg
                      className="mr-1.5 lg:mr-2 h-4 lg:h-5 w-4 lg:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="hidden lg:inline">Host New Event</span>
                    <span className="lg:hidden">New Event</span>
                  </>
                )}
              </button>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-50 z-[55]" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <MobileMenu isOpen={isMenuOpen} />
    </>
  );
}