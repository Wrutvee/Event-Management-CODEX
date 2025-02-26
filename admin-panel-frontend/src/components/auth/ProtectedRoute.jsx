import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { addCsrfToken, fetchCsrfToken } from '../../utils/csrf';
import { useAdminProfile } from '../../context/AdminProfileContext';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { updateProfile } = useAdminProfile();

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const checkAuth = async () => {
      try {
        await fetchCsrfToken();
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/verify`, {
          headers: addCsrfToken(),
          credentials: 'include',
        });
        const data = await response.json();
        
        if (isMounted) {
          if (response.ok && data.success) {
            updateProfile(data.user);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // Remove updateProfile from dependencies

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" />;
}
