import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-card',
    elevated: 'bg-white shadow-card-hover',
    glass: 'glass-effect',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-card'
  }
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
  const Component = onClick ? motion.div : 'div'
  const motionProps = onClick ? {
    whileHover: { scale: hover ? 1.02 : 1, y: hover ? -2 : 0 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <Component
      className={`
        rounded-lg transition-all duration-300
        ${variants[variant]}
        ${paddings[padding]}
        ${hover ? 'cursor-pointer hover:shadow-card-hover' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card