import React from 'react'
import Button from './Button'
import { motion } from 'framer-motion'

const SocialLogin = () => {
  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <Button
        variant="outline"
        className="w-full flex items-center justify-center transition-transform hover:scale-105"
        onClick={() => handleSocialLogin('google')}
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className=" mr-2"
        />
        Continue with Google
      </Button>
    </motion.div>
  )
}

export default SocialLogin