import React from 'react'

const LoadingCard = () => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden">
    <div className="aspect-video bg-gray-200 shimmer"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded shimmer mb-3"></div>
      <div className="h-4 bg-gray-200 rounded shimmer mb-3 w-3/4"></div>
      <div className="flex gap-4 mb-3">
        <div className="h-4 bg-gray-200 rounded shimmer w-16"></div>
        <div className="h-4 bg-gray-200 rounded shimmer w-16"></div>
        <div className="h-4 bg-gray-200 rounded shimmer w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded shimmer mb-2"></div>
      <div className="h-4 bg-gray-200 rounded shimmer w-2/3"></div>
    </div>
  </div>
)

const Loading = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  )
}

export default Loading