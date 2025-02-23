import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import InputField from '../components/InputField';
import Button from '../components/Button';
import SocialLogin from '../components/SocialLogin';
import authService from '../services/authService';
import AnimatedCheckbox from '../components/AnimatedCheckbox';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  // Reset login attempts after 30 minutes
  useEffect(() => {
    const attemptsTimeout = setTimeout(() => {
      setLoginAttempts(0);
    }, 30 * 60 * 1000);

    return () => clearTimeout(attemptsTimeout);
  }, [loginAttempts]);

  const onSubmit = async (data) => {
    try {
      if (loginAttempts >= 5) {
        toast.error('Too many login attempts. Please try again later.');
        return;
      }

      setIsLoading(true);
      await authService.login({ ...data, remember: rememberMe });
      
      // Clear any existing errors
      toast.success('Welcome back!');
      
      const redirect = location.state?.from || '/home';
      navigate(redirect, { replace: true });
      
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      
      if (error.message.includes('credentials')) {
        setError('email', { message: 'Invalid email or password' });
        setError('password', { message: 'Invalid email or password' });
      } else {
        toast.error(error.message || 'Login failed');
      }
      
      console.error('Login error:', error); // Debug log
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md space-y-8"
    >
      <div>
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-center"
        >
          Sign in to your account
        </motion.h2>
        <p className="mt-2 text-center text-gray-600">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <InputField
          label="Email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          error={errors.email}
          icon="fas fa-envelope"
          disabled={isLoading}
        />

        <InputField
          label="Password"
          type="password"
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
          error={errors.password}
          icon="fas fa-lock"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <AnimatedCheckbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          
          <Link 
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          fullWidth
          disabled={isLoading}
          className="transition-transform hover:scale-105"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2" />
              Signing in...
            </span>
          ) : 'Sign in'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <SocialLogin />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Login;