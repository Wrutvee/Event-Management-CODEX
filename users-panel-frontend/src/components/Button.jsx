import React from 'react'

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${widthClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button