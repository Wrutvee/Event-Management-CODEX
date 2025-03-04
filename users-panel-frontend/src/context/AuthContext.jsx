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
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  const checkAuthStatus = async () => {
    try {
      // First try user panel backend
      const userResponse = await axiosInstance.get('/auth/verify');
      if (userResponse.data.success) {
        const userData = {
          ...userResponse.data.user,
          role: 'user',
          registeredEvents: userResponse.data.user.registeredEvents || []
        };
        setUser(userData);
      }
    } catch (userError) {
      try {
        // If user verification fails, try admin panel backend
        const adminResponse = await axiosInstance.get('http://localhost:3000/api/auth/verify', {
          withCredentials: true
        });
        if (adminResponse.data.success) {
          const adminData = {
            ...adminResponse.data.user,
            role: 'admin'
          };
          setUser(adminData);
        }
      } catch (adminError) {
        console.error('Auth check failed:', adminError);
        setUser(null);
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      // Try user login first
      const userLoginResponse = await axiosInstance.post('/auth/signin', {
        email,
        password,
        rememberMe
      });

      if (userLoginResponse.data.success) {
        const userData = {
          ...userLoginResponse.data.user,
          role: 'user'
        };
        setUser(userData);
        toast.success('Successfully logged in!');
        const redirect = location.state?.from?.pathname || '/home';
        navigate(redirect, { replace: true });
        return userLoginResponse.data;
      }
    } catch (userError) {
      try {
        // If user login fails, try admin login
        const adminLoginResponse = await axiosInstance.post('http://localhost:3000/api/auth/signin', {
          email,
          password,
          rememberMe
        }, {
          withCredentials: true
        });

        if (adminLoginResponse.data.success) {
          const adminData = {
            ...adminLoginResponse.data.user,
            role: 'admin'
          };
          setUser(adminData);
          toast.success('Successfully logged in as admin!');
          navigate('/admin/dashboard', { replace: true });
          return adminLoginResponse.data;
        }
      } catch (adminError) {
        toast.error(adminError.response?.data?.message || 'Login failed');
        throw adminError;
      }
    }
  };

  const logout = async () => {
    try {
      if (user?.role === 'admin') {
        await axiosInstance.post('http://localhost:3000/api/auth/logout', {}, {
          withCredentials: true
        });
      } else {
        await axiosInstance.post('/auth/logout');
      }
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