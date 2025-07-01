export const filterProperties = (properties, filters) => {
  return properties.filter(property => {
    // Location filter
    if (filters.location) {
      const locationMatch = 
        property.address.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.title.toLowerCase().includes(filters.location.toLowerCase())
      if (!locationMatch) return false
    }

    // Price filter
    if (filters.priceMin && property.price < parseInt(filters.priceMin)) return false
    if (filters.priceMax && property.price > parseInt(filters.priceMax)) return false

    // Property type filter
    if (filters.propertyType?.length > 0) {
      if (!filters.propertyType.includes(property.type)) return false
    }

    // Bedrooms filter
    if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false

    // Bathrooms filter
    if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false

    // Area filter
    if (filters.areaMin && property.area < parseInt(filters.areaMin)) return false
    if (filters.areaMax && property.area > parseInt(filters.areaMax)) return false

    return true
  })
}

export const sortProperties = (properties, sortBy) => {
  const sorted = [...properties]
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => new Date(b.listed) - new Date(a.listed))
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.listed) - new Date(b.listed))
    case 'size-large':
      return sorted.sort((a, b) => b.area - a.area)
    case 'size-small':
      return sorted.sort((a, b) => a.area - b.area)
    case 'bedrooms-most':
      return sorted.sort((a, b) => b.bedrooms - a.bedrooms)
    case 'bedrooms-least':
      return sorted.sort((a, b) => a.bedrooms - b.bedrooms)
    default:
      return sorted
  }
}

export const getPropertyTypeColor = (type) => {
  const colors = {
    'House': 'bg-green-100 text-green-800',
    'Apartment': 'bg-blue-100 text-blue-800',
    'Condo': 'bg-purple-100 text-purple-800',
    'Townhouse': 'bg-orange-100 text-orange-800',
    'Villa': 'bg-pink-100 text-pink-800',
    'Studio': 'bg-gray-100 text-gray-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const calculatePricePerSqFt = (price, area) => {
  return Math.round(price / area)
}

export const getPropertySearchSuggestions = (properties, query) => {
  if (!query || query.length < 2) return []
  
  const suggestions = new Set()
  const lowerQuery = query.toLowerCase()
  
  properties.forEach(property => {
    // Add address suggestions
    const addressParts = property.address.split(',')
    addressParts.forEach(part => {
      const trimmed = part.trim()
      if (trimmed.toLowerCase().includes(lowerQuery)) {
        suggestions.add(trimmed)
      }
    })
    
    // Add title suggestions
    if (property.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(property.title)
    }
    
    // Add neighborhood suggestions
    const neighborhood = addressParts[1]?.trim()
    if (neighborhood && neighborhood.toLowerCase().includes(lowerQuery)) {
      suggestions.add(neighborhood)
    }
  })
  
  return Array.from(suggestions)
    .slice(0, 8)
    .sort((a, b) => a.length - b.length)
}

export const getActiveFiltersCount = (filters) => {
  let count = 0
  if (filters.location) count++
  if (filters.priceMin || filters.priceMax) count++
  if (filters.propertyType?.length > 0) count++
  if (filters.bedrooms) count++
  if (filters.bathrooms) count++
  if (filters.areaMin || filters.areaMax) count++
  return count
}

export const clearAllFilters = () => ({
  location: '',
  priceMin: '',
  priceMax: '',
  propertyType: [],
  bedrooms: null,
  bathrooms: null,
  areaMin: '',
  areaMax: ''
})

export const isEmptyFilters = (filters) => {
  return !filters.location &&
         !filters.priceMin &&
         !filters.priceMax &&
         (!filters.propertyType || filters.propertyType.length === 0) &&
         !filters.bedrooms &&
         !filters.bathrooms &&
         !filters.areaMin &&
         !filters.areaMax
}