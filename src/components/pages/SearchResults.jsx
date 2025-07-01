import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropertyGrid from '@/components/organisms/PropertyGrid'
import FilterSidebar from '@/components/molecules/FilterSection'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { PropertyService } from '@/services/api/propertyService'

const SearchResults = () => {
  const location = useLocation()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: [],
    bedrooms: null,
    bathrooms: null,
    areaMin: '',
    areaMax: '',
    location: location.state?.searchTerm || ''
  })

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await PropertyService.getAll()
      setProperties(data)
      setFilteredProperties(data)
    } catch (err) {
      setError('Failed to load properties. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, properties, sortBy])

  const applyFilters = () => {
    let filtered = [...properties]

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.address.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.title.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.priceMin))
    }
    if (filters.priceMax) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.priceMax))
    }

    // Property type filter
    if (filters.propertyType?.length > 0) {
      filtered = filtered.filter(property =>
        filters.propertyType.includes(property.type)
      )
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= filters.bedrooms)
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= filters.bathrooms)
    }

    // Area filter
    if (filters.areaMin) {
      filtered = filtered.filter(property => property.area >= parseInt(filters.areaMin))
    }
    if (filters.areaMax) {
      filtered = filtered.filter(property => property.area <= parseInt(filters.areaMax))
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.listed) - new Date(a.listed))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.listed) - new Date(b.listed))
        break
      case 'size-large':
        filtered.sort((a, b) => b.area - a.area)
        break
      case 'size-small':
        filtered.sort((a, b) => a.area - b.area)
        break
      default:
        break
    }

    setFilteredProperties(filtered)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      propertyType: [],
      bedrooms: null,
      bathrooms: null,
      areaMin: '',
      areaMax: '',
      location: ''
    })
  }

  const getActiveFilters = () => {
    const active = []
    if (filters.location) active.push({ key: 'location', label: filters.location })
    if (filters.priceMin) active.push({ key: 'priceMin', label: `Min $${parseInt(filters.priceMin).toLocaleString()}` })
    if (filters.priceMax) active.push({ key: 'priceMax', label: `Max $${parseInt(filters.priceMax).toLocaleString()}` })
    if (filters.propertyType?.length > 0) {
      filters.propertyType.forEach(type => {
        active.push({ key: 'propertyType', label: type, value: type })
      })
    }
    if (filters.bedrooms) active.push({ key: 'bedrooms', label: `${filters.bedrooms}+ Beds` })
    if (filters.bathrooms) active.push({ key: 'bathrooms', label: `${filters.bathrooms}+ Baths` })
    if (filters.areaMin) active.push({ key: 'areaMin', label: `Min ${parseInt(filters.areaMin).toLocaleString()} sq ft` })
    if (filters.areaMax) active.push({ key: 'areaMax', label: `Max ${parseInt(filters.areaMax).toLocaleString()} sq ft` })
    return active
  }

  const removeFilter = (filterKey, value = null) => {
    if (filterKey === 'propertyType' && value) {
      setFilters(prev => ({
        ...prev,
        propertyType: prev.propertyType.filter(type => type !== value)
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        [filterKey]: filterKey === 'propertyType' ? [] : ''
      }))
    }
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'size-large', label: 'Size: Largest First' },
    { value: 'size-small', label: 'Size: Smallest First' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button & Controls */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Button
                onClick={() => setShowMobileFilters(true)}
                variant="outline"
                icon="Filter"
                className="flex-1"
              >
                Filters
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon="Grid3X3"
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon="List"
                  onClick={() => setViewMode('list')}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFilters().length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {getActiveFilters().map((filter, index) => (
                  <Badge
                    key={`${filter.key}-${index}`}
                    variant="primary"
                    removable
                    onRemove={() => removeFilter(filter.key, filter.value)}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Property Grid */}
          <PropertyGrid
            properties={filteredProperties}
            loading={loading}
            error={error}
            onRetry={loadProperties}
            viewMode={viewMode}
          />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setShowMobileFilters(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="w-80 h-full bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setShowMobileFilters(false)}
                />
              </div>
              
              <FilterSidebar 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
              
              <div className="mt-6 pt-6 border-t">
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default SearchResults