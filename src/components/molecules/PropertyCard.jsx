import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const PropertyCard = ({ property, className = '' }) => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`)
  }

  const handleSaveClick = (e) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Removed from saved properties' : 'Added to saved properties')
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card
      variant="default"
      padding="none"
      hover
      onClick={handleCardClick}
      className={`overflow-hidden card-hover ${className}`}
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </button>
            
            {/* Image Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" size="sm">
            {property.type}
          </Badge>
        </div>
        
        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
        >
          <ApperIcon 
            name={isSaved ? "Heart" : "Heart"} 
            size={18} 
            className={isSaved ? "text-red-500 fill-current" : "text-gray-600"} 
          />
        </button>
        
        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 property-card-overlay p-4">
          <div className="text-white">
            <p className="text-2xl font-bold font-display">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <ApperIcon name="MapPin" size={16} className="mr-1" />
          <span className="text-sm">{property.address}</span>
        </div>
        
        {/* Property Features */}
        <div className="flex items-center gap-4 text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <ApperIcon name="Bed" size={16} />
            <span className="text-sm">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Bath" size={16} />
            <span className="text-sm">{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Square" size={16} />
            <span className="text-sm">{property.area.toLocaleString()} sq ft</span>
          </div>
        </div>
        
        {/* Description Preview */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {property.description}
        </p>
        
        {/* Listed Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Listed {new Date(property.listed).toLocaleDateString()}</span>
          <span className="text-primary font-medium">View Details →</span>
        </div>
      </div>
    </Card>
  )
}

export default PropertyCard