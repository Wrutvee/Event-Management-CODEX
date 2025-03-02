import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't check auth status on login and signup pages
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get('/auth/verify');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      // Only redirect to login if not already on login page
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axiosInstance.post('/auth/signin', {
        email,
        password,
        rememberMe
      });

      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Successfully logged in!');
        const redirect = location.state?.from?.pathname || '/home';
        navigate(redirect, { replace: true });
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
      navigate('/login', { replace: true });
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};