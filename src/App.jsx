import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import SearchResults from '@/components/pages/SearchResults'
import PropertyDetail from '@/components/pages/PropertyDetail'
import MapView from '@/components/pages/MapView'
import SavedProperties from '@/components/pages/SavedProperties'
import Contact from '@/components/pages/Contact'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SearchResults />} />
          <Route path="/buy" element={<SearchResults />} />
          <Route path="/rent" element={<SearchResults />} />
          <Route path="/sell" element={<Contact />} />
          <Route path="/saved" element={<SavedProperties />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/map" element={<MapView />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App