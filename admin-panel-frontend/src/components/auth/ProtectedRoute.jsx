import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { addCsrfToken, fetchCsrfToken } from '../../utils/csrf';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchCsrfToken();
        const response = await fetch('http://localhost:3000/auth/verify', {
            headers: addCsrfToken(),
            credentials: 'include',
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" />;
}