import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCsrfToken, fetchCsrfToken, invalidateToken } from '../../../utils/csrf';
import { useAdminProfile } from '../../../context/AdminProfileContext';
import { truncateString } from '../../../utils/stringUtils';
import avatar from '/avatar.png';

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { adminProfile, clearProfile } = useAdminProfile();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetchCsrfToken();
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/logout`, {
        method: 'POST',
        headers: addCsrfToken(),
        credentials: 'include',
      });

      if (response.ok) {
        invalidateToken();
        clearProfile();
        navigate('/signin');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={adminProfile?.profilePic || avatar}
          alt={adminProfile?.name || 'Profile'}
        />
        <div className="hidden md:block text-left mr-2">
          <div className="text-sm font-medium text-gray-900">
            {truncateString(adminProfile?.name)}
          </div>
          <div className="text-xs text-gray-500">{adminProfile?.role}</div>
        </div>
        <svg 
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => navigate('/invite')}
            >
              Invite Admins
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? <div className="dots-loader" /> : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}