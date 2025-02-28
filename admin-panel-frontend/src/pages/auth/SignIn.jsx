import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminProfile } from "../../context/AdminProfileContext";
import mainLogo from '/logos/main_logo.png'
import { addCsrfToken, fetchCsrfToken } from "../../utils/csrf";

export default function LoginPage() {
  const navigate = useNavigate();
  const { adminProfile, updateProfile } = useAdminProfile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchCsrfToken();
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/verify`, {
          headers: addCsrfToken(),
          credentials: 'include',
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          updateProfile(data.user);
          navigate('/home');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate, updateProfile]);

  if (isChecking) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="dots-loader" />
    </div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      await fetchCsrfToken();
      
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/signin`, {
        method: 'POST',
        headers: addCsrfToken({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      await updateProfile(data.user);
      navigate("/home", { replace: true });
    } catch (error) {
      setError(error.message || 'Error during signin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <img
            src={mainLogo}
            alt="Logo"
            className="w-20 h-20"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mt-4">
          Admin Login
        </h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-blue-500 text-sm">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {isLoading ? <div className="dots-loader" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}