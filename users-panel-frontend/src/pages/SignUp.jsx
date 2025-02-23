import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import InputField from '../components/InputField'
import SocialLogin from '../components/SocialLogin'
import AnimatedCheckbox from '../components/AnimatedCheckbox'

function SignUp() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')
  const [rememberMe, setRememberMe] = useState(false)

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', { message: 'Passwords do not match' })
        return
      }
      
      // Simulate signup success
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(data))
      navigate('/home', { replace: true })
    } catch (error) {
      console.error('Signup failed:', error)
    }
  }

  return (
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="space-y-6"
        >
          <InputField
            label="Full Name"
            {...register('name', { 
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            error={errors.name}
            icon="fas fa-user"
          />

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
          />

          <InputField
            label="Confirm Password"
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            error={errors.confirmPassword}
            icon="fas fa-lock"
          />
        </motion.div>

        <div className="flex items-center mb-4">
          <AnimatedCheckbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </div>

        <Button 
          type="submit" 
          fullWidth
          className="transition-transform hover:scale-105"
        >
          Create Account
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
    
  )
}

export default SignUp