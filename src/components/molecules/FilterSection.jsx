import React from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const FilterSection = ({ 
  title, 
  children, 
  isOpen = true, 
  onToggle, 
  className = '' 
}) => {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-gray-500" 
        />
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ overflow: 'hidden' }}
      >
        {children}
      </motion.div>
    </div>
  )
}

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters }) => {
  const [openSections, setOpenSections] = React.useState({
    price: true,
    type: true,
    bedrooms: true,
    bathrooms: true,
    area: true
  })

  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Studio']
  const bedroomOptions = [1, 2, 3, 4, 5, 6]
  const bathroomOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5]

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = filters.propertyType || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    
    handleFilterChange('propertyType', newTypes)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.priceMin || filters.priceMax) count++
    if (filters.propertyType?.length > 0) count++
    if (filters.bedrooms) count++
    if (filters.bathrooms) count++
    if (filters.areaMin || filters.areaMax) count++
    return count
  }

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold text-gray-900">
          Filters
        </h2>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            icon="X"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.priceMin || ''}
            onChange={(e) => handleFilterChange('priceMin', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.priceMax || ''}
            onChange={(e) => handleFilterChange('priceMax', e.target.value)}
          />
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection
        title="Property Type"
        isOpen={openSections.type}
        onToggle={() => toggleSection('type')}
      >
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map(type => (
            <Badge
              key={type}
              variant={filters.propertyType?.includes(type) ? 'primary' : 'default'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => handlePropertyTypeToggle(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection
        title="Bedrooms"
        isOpen={openSections.bedrooms}
        onToggle={() => toggleSection('bedrooms')}
      >
        <div className="flex flex-wrap gap-2">
          {bedroomOptions.map(num => (
            <Badge
              key={num}
              variant={filters.bedrooms === num ? 'primary' : 'default'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => handleFilterChange('bedrooms', num)}
            >
              {num}+
            </Badge>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection
        title="Bathrooms"
        isOpen={openSections.bathrooms}
        onToggle={() => toggleSection('bathrooms')}
      >
        <div className="flex flex-wrap gap-2">
          {bathroomOptions.map(num => (
            <Badge
              key={num}
              variant={filters.bathrooms === num ? 'primary' : 'default'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => handleFilterChange('bathrooms', num)}
            >
              {num}+
            </Badge>
          ))}
        </div>
      </FilterSection>

      {/* Area */}
      <FilterSection
        title="Square Footage"
        isOpen={openSections.area}
        onToggle={() => toggleSection('area')}
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min Sq Ft"
            value={filters.areaMin || ''}
            onChange={(e) => handleFilterChange('areaMin', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Sq Ft"
            value={filters.areaMax || ''}
            onChange={(e) => handleFilterChange('areaMax', e.target.value)}
          />
        </div>
      </FilterSection>
    </div>
  )
}

export default FilterSidebar