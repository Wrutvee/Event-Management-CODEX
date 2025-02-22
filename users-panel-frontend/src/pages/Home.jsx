import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Event Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-2 sm:ml-4 px-3 sm:px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:py-6">
        <div className="px-2 sm:px-4 lg:px-8">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Welcome to Event Management</h2>
              <p className="text-sm sm:text-base text-gray-600">
                This is your dashboard where you can manage your events.
              </p>
            </div>
            
            <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Example card */}
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">Upcoming Events</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    View and manage your upcoming events
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home