import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PropertyGrid from '@/components/organisms/PropertyGrid'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { PropertyService } from '@/services/api/propertyService'

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([])
  const [savedSearches, setSavedSearches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('properties')

  const loadSavedData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // In a real app, this would load saved properties from user preferences
      // For demo, we'll show a few sample properties
      const allProperties = await PropertyService.getAll()
      const sampleSaved = allProperties.slice(0, 3)
      setSavedProperties(sampleSaved)
      
      // Sample saved searches
      setSavedSearches([
        {
          Id: 1,
          name: 'Manhattan Apartments',
          filters: {
            location: 'Manhattan, NY',
            propertyType: ['Apartment'],
            priceMin: 500000,
            priceMax: 2000000,
            bedrooms: 2
          },
          created: new Date('2024-01-15')
        },
        {
          Id: 2,
          name: 'Brooklyn Houses',
          filters: {
            location: 'Brooklyn, NY',
            propertyType: ['House'],
            priceMin: 800000,
            priceMax: 1500000,
            bedrooms: 3
          },
          created: new Date('2024-01-20')
        }
      ])
    } catch (err) {
      setError('Failed to load saved items.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedData()
  }, [])

  const handleRemoveProperty = (propertyId) => {
    setSavedProperties(prev => prev.filter(p => p.Id !== propertyId))
  }

  const handleRemoveSearch = (searchId) => {
    setSavedSearches(prev => prev.filter(s => s.Id !== searchId))
  }

  const formatSearchFilters = (filters) => {
    const parts = []
    if (filters.location) parts.push(filters.location)
    if (filters.propertyType?.length) parts.push(filters.propertyType.join(', '))
    if (filters.priceMin || filters.priceMax) {
      const priceRange = `$${filters.priceMin?.toLocaleString() || '0'} - $${filters.priceMax?.toLocaleString() || '∞'}`
      parts.push(priceRange)
    }
    if (filters.bedrooms) parts.push(`${filters.bedrooms}+ beds`)
    return parts.join(' • ')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          Saved Items
        </h1>
        <p className="text-gray-600 text-lg">
          Keep track of your favorite properties and searches
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-8">
            <button
              onClick={() => setActiveTab('properties')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'properties'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Heart" size={16} />
                Saved Properties ({savedProperties.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('searches')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'searches'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Search" size={16} />
                Saved Searches ({savedSearches.length})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'properties' && (
        <div>
          {savedProperties.length > 0 ? (
            <PropertyGrid
              properties={savedProperties}
              loading={loading}
              error={error}
              onRetry={loadSavedData}
            />
          ) : (
            <Empty
              title="No saved properties yet"
              description="Start exploring properties and save the ones you like by clicking the heart icon."
              showActions={true}
            />
          )}
        </div>
      )}

      {activeTab === 'searches' && (
        <div>
          {savedSearches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSearches.map((search) => (
                <motion.div
                  key={search.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card variant="gradient" padding="lg" className="h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-display font-semibold text-lg text-gray-900">
                        {search.name}
                      </h3>
                      <button
                        onClick={() => handleRemoveSearch(search.Id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {formatSearchFilters(search.filters)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Saved {search.created.toLocaleDateString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Search"
                      >
                        Run Search
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Empty
              title="No saved searches yet"
              description="Save your search criteria to quickly find properties that match your preferences."
              showActions={true}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default SavedProperties