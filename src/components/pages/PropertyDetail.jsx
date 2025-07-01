import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { PropertyService } from '@/services/api/propertyService'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const loadProperty = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await PropertyService.getById(parseInt(id))
      setProperty(data)
    } catch (err) {
      setError('Property not found or failed to load.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperty()
  }, [id])

  const handleSaveProperty = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Removed from saved properties' : 'Added to saved properties')
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    toast.success('Your message has been sent! An agent will contact you soon.')
    setContactForm({ name: '', email: '', phone: '', message: '' })
  }

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-96 bg-gray-200 rounded-lg shimmer"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded shimmer"></div>
              <div className="h-4 bg-gray-200 rounded shimmer w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded shimmer"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded shimmer"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadProperty} />
      </div>
    )
  }

  if (!property) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          icon="ArrowLeft"
          onClick={() => navigate(-1)}
        >
          Back to Results
        </Button>
      </div>

      {/* Main Image Gallery */}
      <Card variant="default" padding="none" className="mb-8 overflow-hidden">
        <div className="relative">
          <div 
            className="aspect-video cursor-pointer"
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev === 0 ? property.images.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <ApperIcon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev === property.images.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <ApperIcon name="ChevronRight" size={20} />
              </button>
            </>
          )}
          
          {/* Property Type & Save */}
          <div className="absolute top-4 left-4">
            <Badge variant="primary">
              {property.type}
            </Badge>
          </div>
          
          <div className="absolute top-4 right-4">
            <Button
              variant={isSaved ? 'primary' : 'ghost'}
              size="sm"
              icon="Heart"
              onClick={handleSaveProperty}
              className="bg-white/90 hover:bg-white"
            />
          </div>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>
        
        {/* Thumbnail Strip */}
        {property.images.length > 1 && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex gap-2 overflow-x-auto">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Header */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              {property.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <ApperIcon name="MapPin" size={20} className="mr-2" />
              <span className="text-lg">{property.address}</span>
            </div>
            
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <ApperIcon name="Bed" size={20} className="text-gray-600" />
                <span className="font-medium">{property.bedrooms}</span>
                <span className="text-gray-600">bed{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Bath" size={20} className="text-gray-600" />
                <span className="font-medium">{property.bathrooms}</span>
                <span className="text-gray-600">bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Square" size={20} className="text-gray-600" />
                <span className="font-medium">{property.area.toLocaleString()}</span>
                <span className="text-gray-600">sq ft</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card variant="gradient" padding="lg">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
              About This Property
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {property.description}
            </p>
          </Card>

          {/* Features */}
          <Card variant="gradient" padding="lg">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
              Features & Amenities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <ApperIcon name="Check" size={16} className="text-green-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card variant="elevated" padding="lg" className="sticky top-24">
            <div className="text-center mb-6">
              <p className="text-4xl font-display font-bold gradient-text mb-2">
                {formatPrice(property.price)}
              </p>
              <p className="text-gray-600">
                Listed {new Date(property.listed).toLocaleDateString()}
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Agent
              </h3>
              
              <Input
                label="Full Name"
                type="text"
                value={contactForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                value={contactForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              
              <Input
                label="Phone Number"
                type="tel"
                value={contactForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="I'm interested in this property..."
                />
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ApperIcon name="X" size={24} />
            </button>
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(prev => 
                      prev === 0 ? property.images.length - 1 : prev - 1
                    )
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                >
                  <ApperIcon name="ChevronLeft" size={24} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(prev => 
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                >
                  <ApperIcon name="ChevronRight" size={24} />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PropertyDetail