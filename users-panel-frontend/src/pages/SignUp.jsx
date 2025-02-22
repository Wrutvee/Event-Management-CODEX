import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import InputField from '../components/InputField'
import SocialLogin from '../components/SocialLogin'

function SignUp() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

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
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold text-center text-gray-900"
      >
        Create your account
      </motion.h1>

      <h2 className="text-2xl sm:text-3xl font-bold text-center">Sign in to your account</h2>

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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')}
            className="mt-2 transition-transform hover:scale-105"
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SignUp