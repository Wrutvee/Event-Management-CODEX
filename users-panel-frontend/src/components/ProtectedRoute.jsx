import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  // For now, we'll simulate authentication with localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute