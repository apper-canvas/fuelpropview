import React from 'react'
import { motion } from 'framer-motion'
import PropertyCard from '@/components/molecules/PropertyCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry,
  viewMode = 'grid',
  className = '' 
}) => {
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />
  }

  if (!properties || properties.length === 0) {
    return <Empty />
  }

  const gridClasses = viewMode === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'flex flex-col gap-4'

  return (
    <div className={`${className}`}>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} found
        </p>
      </div>

      {/* Property Grid */}
      <motion.div 
        className={gridClasses}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {properties.map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PropertyCard 
              property={property}
              className={viewMode === 'list' ? 'flex flex-row' : ''}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default PropertyGrid