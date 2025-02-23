import React from 'react';import { motion } from 'framer-motion';const AnimatedCheckbox = ({ checked, onChange }) => {  const checkVariants = {    checked: {      pathLength: 1,      opacity: 1,      transition: {        duration: 0.2,        ease: "easeInOut"      }    },    unchecked: {      pathLength: 0,      opacity: 0,      transition: {        duration: 0.2,        ease: "easeInOut"      }    }  };  return (    <label className="flex items-center cursor-pointer select-none">      <div className="relative">        <input          type="checkbox"          checked={checked}          onChange={onChange}          className="sr-only"        />        <motion.div          initial={false}          animate={{            scale: checked ? [1.1, 1] : 1,            transition: { duration: 0.2 }          }}          className="w-4 h-4 border-2 border-black rounded bg-white"        >          <motion.svg            viewBox="0 0 24 24"            className="w-full h-full stroke-black fill-none stroke-2"          >            <motion.path
              d="M4 12.5L9 17.5L20 6.5"
              variants={checkVariants}
              initial="unchecked"
              animate={checked ? "checked" : "unchecked"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </div>
      <span className="ml-2 text-sm text-gray-600">Remember me</span>
    </label>
  );
};

export default AnimatedCheckbox;