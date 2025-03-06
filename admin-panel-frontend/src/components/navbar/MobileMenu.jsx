import { Link, useLocation, useNavigate } from 'react-router-dom';
import { truncateString } from '../../utils/stringUtils';
import avatar from '/avatar.png';
import { useAdminProfile } from '../../context/AdminProfileContext';
import PageLoader from '../common/PageLoader';
import { useState } from 'react';

export default function MobileMenu({ isOpen }) {
  const { adminProfile } = useAdminProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleClick = () => {
    setIsNavigating(true);
    navigate("/events/create");
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden z-60`}
    >
      {/* Profile Section */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={adminProfile?.profilePic || avatar}
            alt={adminProfile?.name || "Profile"}
          />
          <div>
            <div className="font-medium text-gray-900">
              {truncateString(adminProfile?.name)}
            </div>
            <div className="text-sm text-gray-500">{adminProfile?.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="px-2 pt-4 space-y-1">
        <Link
          to="/home"
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
            isActive("/home")
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className={`mr-3 h-5 w-5 ${
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
        {/* <Link
          to="/analytics"
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
            isActive("/analytics")
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className={`mr-3 h-5 w-5 ${
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
          className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
            isActive("/resources")
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg
            className={`mr-3 h-5 w-5 ${
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
        </Link> */}

        {/* Host New Event Button */}
        <button
          onClick={handleClick}
          disabled={isNavigating}
          className="w-full mt-4 px-3 py-2 text-left rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center disabled:opacity-75"
        >
          {isNavigating ? (
            <div>
              <PageLoader />
            </div>
          ) : (
            <>
              <svg
                className="mr-3 h-5 w-5"
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
              Host New Event
            </>
          )}
        </button>
      </nav>
    </div>
  );
}