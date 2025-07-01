import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No properties found",
  description = "We couldn't find any properties matching your criteria. Try adjusting your filters or search in a different area.",
  showActions = true,
  className = '' 
}) => {
  const navigate = useNavigate()

  const handleViewAll = () => {
    navigate('/')
  }

  const handleContact = () => {
    navigate('/contact')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex justify-center items-center min-h-[500px] ${className}`}
    >
      <Card variant="gradient" padding="xl" className="max-w-lg text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary/20 to-orange-300/20 rounded-full flex items-center justify-center mb-6">
            <ApperIcon name="Search" size={40} className="text-secondary" />
          </div>
          <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
            {title}
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            {description}
          </p>
        </div>
        
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleViewAll}
              icon="Home"
              size="lg"
            >
              View All Properties
            </Button>
            <Button
              onClick={handleContact}
              variant="outline"
              icon="MessageCircle"
              size="lg"
            >
              Contact an Agent
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default Empty