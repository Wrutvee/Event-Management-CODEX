import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Notifications() {
  const navigate = useNavigate();

  // Function to handle going back
  const handleGoBack = () => {
    navigate(-1); // This navigates back to the previous page in history
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {/* You can map through your notifications here */}
            <li className="px-6 py-4 flex items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-indigo-600">New Event Added</p>
                <p className="text-sm text-gray-500">A new event has been added to your calendar.</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </li>
            <li className="px-6 py-4 flex items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-indigo-600">Reminder</p>
                <p className="text-sm text-gray-500">You have an upcoming event tomorrow.</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </li>
            {/* Add more notification items as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notifications;