// Initialize ApperClient for database operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

// Property fields for database operations
const propertyFields = [
  { "field": { "Name": "Name" } },
  { "field": { "Name": "Tags" } },
  { "field": { "Name": "Owner" } },
  { "field": { "Name": "CreatedOn" } },
  { "field": { "Name": "CreatedBy" } },
  { "field": { "Name": "ModifiedOn" } },
  { "field": { "Name": "ModifiedBy" } },
  { "field": { "Name": "title" } },
  { "field": { "Name": "price" } },
  { "field": { "Name": "type" } },
  { "field": { "Name": "bedrooms" } },
  { "field": { "Name": "bathrooms" } },
  { "field": { "Name": "area" } },
  { "field": { "Name": "address" } },
  { "field": { "Name": "coordinates_lat" } },
  { "field": { "Name": "coordinates_lng" } },
  { "field": { "Name": "images" } },
  { "field": { "Name": "description" } },
  { "field": { "Name": "features" } },
  { "field": { "Name": "listed" } }
]

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'Owner', 'title', 'price', 'type', 'bedrooms', 
  'bathrooms', 'area', 'address', 'coordinates_lat', 'coordinates_lng',
  'images', 'description', 'features', 'listed'
]

export const PropertyService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: propertyFields,
        orderBy: [
          {
            "fieldName": "listed",
            "sorttype": "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords('property', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      // Transform database records to match existing property structure
      return response.data.map(property => ({
        ...property,
        coordinates: {
          lat: property.coordinates_lat,
          lng: property.coordinates_lng
        },
        // Parse images and features if they're stored as strings
        images: typeof property.images === 'string' ? property.images.split(',').map(img => img.trim()) : property.images || [],
        features: typeof property.features === 'string' ? property.features.split(',').map(feature => feature.trim()) : property.features || []
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error?.response?.data?.message)  
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: propertyFields
      }
      
      const response = await apperClient.getRecordById('property', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      const property = response.data
      
      // Transform database record to match existing property structure
      return {
        ...property,
        coordinates: {
          lat: property.coordinates_lat,
          lng: property.coordinates_lng
        },
        // Parse images and features if they're stored as strings
        images: typeof property.images === 'string' ? property.images.split(',').map(img => img.trim()) : property.images || [],
        features: typeof property.features === 'string' ? property.features.split(',').map(feature => feature.trim()) : property.features || []
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${id}:`, error?.response?.data?.message)  
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async create(propertyData) {
    try {
      const apperClient = getApperClient()
      
      // Filter to only include updateable fields
      const filteredData = {}
      updateableFields.forEach(field => {
        if (propertyData.hasOwnProperty(field)) {
          filteredData[field] = propertyData[field]
        }
      })
      
      // Handle coordinates transformation
      if (propertyData.coordinates) {
        filteredData.coordinates_lat = propertyData.coordinates.lat
        filteredData.coordinates_lng = propertyData.coordinates.lng
      }
      
      // Convert arrays to comma-separated strings for database storage
      if (Array.isArray(filteredData.images)) {
        filteredData.images = filteredData.images.join(', ')
      }
      if (Array.isArray(filteredData.features)) {
        filteredData.features = filteredData.features.join(', ')
      }
      
      const params = {
        records: [filteredData]
      }
      
      const response = await apperClient.createRecord('property', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulRecord = response.results.find(result => result.success)
        return successfulRecord ? successfulRecord.data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating property:", error?.response?.data?.message)  
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async update(id, propertyData) {
    try {
      const apperClient = getApperClient()
      
      // Filter to only include updateable fields
      const filteredData = { Id: id }
      updateableFields.forEach(field => {
        if (propertyData.hasOwnProperty(field)) {
          filteredData[field] = propertyData[field]
        }
      })
      
      // Handle coordinates transformation
      if (propertyData.coordinates) {
        filteredData.coordinates_lat = propertyData.coordinates.lat
        filteredData.coordinates_lng = propertyData.coordinates.lng
      }
      
      // Convert arrays to comma-separated strings for database storage
      if (Array.isArray(filteredData.images)) {
        filteredData.images = filteredData.images.join(', ')
      }
      if (Array.isArray(filteredData.features)) {
        filteredData.features = filteredData.features.join(', ')
      }
      
      const params = {
        records: [filteredData]
      }
      
      const response = await apperClient.updateRecord('property', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulRecord = response.results.find(result => result.success)
        return successfulRecord ? successfulRecord.data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating property:", error?.response?.data?.message)  
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: Array.isArray(id) ? id : [id]
      }
      
      const response = await apperClient.deleteRecord('property', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return response.results.every(result => result.success)
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting property:", error?.response?.data?.message)  
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
}