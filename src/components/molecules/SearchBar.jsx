import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ onSearch, placeholder = "Search by location, city, or neighborhood...", className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions] = useState([
    'Manhattan, NY',
    'Brooklyn, NY',
    'Queens, NY',
    'Los Angeles, CA',
    'San Francisco, CA',
    'Miami, FL',
    'Chicago, IL',
    'Austin, TX'
  ])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (value.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    if (onSearch) {
      onSearch(suggestion)
    }
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm)
    }
    setShowSuggestions(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
            icon="Search"
            className="w-full"
          />
          
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <ApperIcon name="MapPin" size={16} className="text-gray-400" />
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        <Button 
          onClick={handleSearch}
          icon="Search"
          size="lg"
          className="shrink-0"
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default SearchBar