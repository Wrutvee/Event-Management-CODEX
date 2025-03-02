import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import InputField from '../components/InputField';
import SocialLogin from '../components/SocialLogin';
import AnimatedCheckbox from '../components/AnimatedCheckbox';
import { toast } from 'react-hot-toast';
import { isPasswordStrong, sanitizeInput } from '../utils/security';
import axiosInstance from '../services/axiosConfig';

function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm();
  const password = watch('password');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    isStrong: false,
    message: ''
  });

  // Add password strength validation
  const validatePassword = (value) => {
    if (!value) return true;
    
    const isStrong = isPasswordStrong(value);
    setPasswordStrength({
      isStrong,
      message: isStrong ? '' : 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    });
    
    return isStrong || 'Password is not strong enough';
  };

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', { message: 'Passwords do not match' });
        return;
      }
  
      // Validate password strength
      if (!isPasswordStrong(data.password)) {
        setError('password', { 
          message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
        });
        return;
      }
  
      setIsLoading(true);
      
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        password: data.password // Don't sanitize password
      };
      
      const response = await axiosInstance.post('/auth/signup', sanitizedData);
  
      if (response.data.success) {
        toast.success('Account created successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <motion.h2
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Create your account
            </motion.h2>
            <motion.p
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-2 text-sm text-gray-600"
            >
              Join us today and start your journey
            </motion.p>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="mt-8 space-y-6"
            autoComplete="on"
          >
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="space-y-6"
            >
              <InputField
                label="Full Name"
                autoComplete="name"
                {...register('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                error={errors.name}
                icon="fas fa-user"
                disabled={isLoading}
              />

              <InputField
                label="Email"
                type="email"
                autoComplete="email"
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
                autoComplete="new-password"
                {...register('password', { 
                  required: 'Password is required',
                  validate: validatePassword
                })}
                error={errors.password}
                icon="fas fa-lock"
                disabled={isLoading}
              />

              <InputField
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                error={errors.confirmPassword}
                icon="fas fa-lock"
                disabled={isLoading}
              />
            </motion.div>

            <div className="flex items-center mb-4">
              <AnimatedCheckbox
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                label="I agree to the Terms of Service and Privacy Policy"
              />
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
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <SocialLogin />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUp