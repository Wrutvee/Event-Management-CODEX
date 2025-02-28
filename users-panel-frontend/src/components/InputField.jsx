import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const InputField = forwardRef(({ 
  label, 
  error, 
  icon, 
  type = 'text',
  autoComplete,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`${icon} text-gray-400`} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          autoComplete={autoComplete}
          className={`
            block w-full 
            ${icon ? 'pl-10' : 'pl-3'} 
            pr-3 py-2 
            border rounded-md 
            shadow-sm 
            focus:ring-indigo-500 
            focus:border-indigo-500 
            sm:text-sm
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;