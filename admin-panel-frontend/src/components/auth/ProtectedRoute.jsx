import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { addCsrfToken, fetchCsrfToken } from '../../utils/csrf';
import { useAdminProfile } from '../../context/AdminProfileContext';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { updateProfile } = useAdminProfile();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchCsrfToken();
        const response = await fetch('http://localhost:3000/auth/verify', {
            headers: addCsrfToken(),
            credentials: 'include',
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          updateProfile(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [updateProfile]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" />;
}