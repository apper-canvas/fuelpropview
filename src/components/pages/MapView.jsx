import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import PropertyCard from '@/components/molecules/PropertyCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { PropertyService } from '@/services/api/propertyService'

const MapView = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }) // NYC default
  const [zoom, setZoom] = useState(12)

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await PropertyService.getAll()
      setProperties(data)
    } catch (err) {
      setError('Failed to load properties. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleMarkerClick = (property) => {
    setSelectedProperty(property)
    setMapCenter(property.coordinates)
  }

  const handleClosePropertyCard = () => {
    setSelectedProperty(null)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading count={1} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Error message={error} onRetry={loadProperties} />
      </div>
    )
  }

  return (
    <div className="h-screen relative">
      {/* Map Container */}
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {/* Placeholder Map */}
        <Card variant="elevated" padding="xl" className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-secondary to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Map" size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
            Interactive Map View
          </h3>
          <p className="text-gray-600 mb-6">
            Explore properties on an interactive map. This is a demo view showing property locations and details.
          </p>
          
          {/* Mock Property Markers Info */}
          <div className="text-left space-y-3">
            <p className="text-sm font-medium text-gray-900">
              {properties.length} properties available in this area:
            </p>
            {properties.slice(0, 3).map((property) => (
              <div key={property.Id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{property.title}</span>
                <Badge variant="primary" size="sm">
                  {formatPrice(property.price)}
                </Badge>
              </div>
            ))}
            {properties.length > 3 && (
              <p className="text-sm text-gray-600">
                +{properties.length - 3} more properties
              </p>
            )}
          </div>
        </Card>

        {/* Property Markers (Simulated) */}
        {properties.slice(0, 5).map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute bg-white rounded-full p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            style={{
              top: `${30 + index * 15}%`,
              left: `${20 + index * 15}%`
            }}
            onClick={() => handleMarkerClick(property)}
          >
            <div className="flex items-center gap-2 px-2 py-1">
              <ApperIcon name="Home" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                ${Math.round(property.price / 1000)}K
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <Button
          variant="secondary"
          size="sm"
          icon="Plus"
          onClick={() => setZoom(prev => prev + 1)}
          className="bg-white shadow-md"
        />
        <Button
          variant="secondary"
          size="sm"
          icon="Minus"
          onClick={() => setZoom(prev => Math.max(1, prev - 1))}
          className="bg-white shadow-md"
        />
      </div>

      {/* Map Type Toggle */}
      <div className="absolute top-4 right-4">
        <div className="bg-white rounded-lg shadow-md p-1 flex">
          <button className="px-3 py-2 rounded-md bg-primary text-white text-sm">
            Map
          </button>
          <button className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm">
            Satellite
          </button>
        </div>
      </div>

      {/* Selected Property Card */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="absolute bottom-4 left-4 right-4 md:left-auto md:w-96"
        >
          <div className="relative">
            <PropertyCard property={selectedProperty} />
            <button
              onClick={handleClosePropertyCard}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1 rounded-full shadow-sm"
            >
              <ApperIcon name="X" size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Property List Toggle */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          variant="primary"
          icon="List"
          onClick={() => window.history.back()}
        >
          Back to List View
        </Button>
      </div>
    </div>
  )
}

export default MapView