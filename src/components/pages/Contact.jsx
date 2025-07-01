import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: 'buy'
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Thank you for your message! We\'ll get back to you within 24 hours.')
    setContactForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      propertyType: 'buy'
    })
    setLoading(false)
  }

  const contactInfo = [
    {
      icon: 'Phone',
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri 9am-7pm, Sat-Sun 10am-5pm'
    },
    {
      icon: 'Mail',
      title: 'Email',
      value: 'hello@propview.com',
      description: 'We respond within 24 hours'
    },
    {
      icon: 'MapPin',
      title: 'Office',
      value: '123 Real Estate Blvd',
      description: 'New York, NY 10001'
    },
    {
      icon: 'MessageCircle',
      title: 'Live Chat',
      value: 'Available 24/7',
      description: 'Instant support for urgent needs'
    }
  ]

  const services = [
    {
      icon: 'Home',
      title: 'Buying',
      description: 'Find your perfect home with our expert guidance and extensive property database.'
    },
    {
      icon: 'Key',
      title: 'Renting',
      description: 'Discover rental properties that match your lifestyle and budget requirements.'
    },
    {
      icon: 'DollarSign',
      title: 'Selling',
      description: 'Get top dollar for your property with our proven marketing strategies.'
    },
    {
      icon: 'TrendingUp',
      title: 'Investment',
      description: 'Build wealth through real estate with our investment property expertise.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ready to find your dream home or sell your property? Our experienced team is here to help you every step of the way.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card variant="elevated" padding="lg">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Interest Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I'm interested in:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['buy', 'rent', 'sell'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('propertyType', type)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        contactForm.propertyType === type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-300 text-gray-700 hover:border-primary/50'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}ing
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                <Input
                  label="Subject"
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Tell us more about what you're looking for..."
                  required
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Contact Methods */}
          <Card variant="gradient" padding="lg">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Contact Information
            </h2>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <ApperIcon name={info.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{info.title}</h3>
                    <p className="text-primary font-medium">{info.value}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Services */}
          <Card variant="gradient" padding="lg">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Our Services
            </h2>
            
            <div className="space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <ApperIcon name={service.icon} size={18} className="text-secondary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Call to Action */}
          <Card variant="elevated" padding="lg" className="text-center bg-gradient-to-r from-primary to-blue-600 text-white">
            <h3 className="text-xl font-display font-semibold mb-2">
              Ready to Get Started?
            </h3>
            <p className="mb-4 opacity-90">
              Schedule a free consultation with one of our experts today.
            </p>
            <Button
              variant="secondary"
              icon="Calendar"
              className="bg-white text-primary hover:bg-gray-50"
            >
              Book a Consultation
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Contact