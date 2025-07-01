import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong while loading the properties.",
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex justify-center items-center min-h-[400px] ${className}`}
    >
      <Card variant="gradient" padding="lg" className="max-w-md text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600">
            {message}
          </p>
        </div>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            icon="RefreshCw"
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default Error