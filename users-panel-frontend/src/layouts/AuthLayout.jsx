import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[90%] sm:max-w-md space-y-8 bg-white p-4 sm:p-8 rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout