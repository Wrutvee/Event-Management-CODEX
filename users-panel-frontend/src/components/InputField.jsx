import React from 'react'
import { forwardRef } from 'react'

const InputField = forwardRef(({ label, type = 'text', error, ...props }, ref) => {
  return (
    <div className="space-y-1">
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        ref={ref}
        {...props}
        className={`
          w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base
          border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && (
        <p className="text-xs sm:text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  )
})

InputField.displayName = 'InputField'

export default InputField