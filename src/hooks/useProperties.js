import { useState, useEffect } from 'react'
import { PropertyService } from '@/services/api/propertyService'

export const useProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const refetch = () => {
    loadProperties()
  }

  return {
    properties,
    loading,
    error,
    refetch
  }
}

export const useProperty = (id) => {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    if (id) {
      loadProperty()
    }
  }, [id])

  const refetch = () => {
    loadProperty()
  }

  return {
    property,
    loading,
    error,
    refetch
  }
}