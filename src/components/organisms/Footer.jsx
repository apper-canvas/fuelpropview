import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Footer = () => {
  const footerSections = [
    {
      title: 'PropView',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' }
      ]
    },
    {
      title: 'For Buyers',
      links: [
        { label: 'Buy a Home', href: '/buy' },
        { label: 'Rent a Home', href: '/rent' },
        { label: 'Mortgage Calculator', href: '/calculator' },
        { label: 'Buyer Guide', href: '/buyer-guide' }
      ]
    },
    {
      title: 'For Sellers',
      links: [
        { label: 'Sell Your Home', href: '/sell' },
        { label: 'Home Valuation', href: '/valuation' },
        { label: 'Seller Guide', href: '/seller-guide' },
        { label: 'Market Trends', href: '/trends' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Blog', href: '/blog' },
        { label: 'Legal', href: '/legal' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-secondary to-orange-400 p-2 rounded-lg">
                  <ApperIcon name="Home" size={24} className="text-white" />
                </div>
                <span className="text-xl font-display font-bold gradient-text">
                  PropView
                </span>
              </Link>
              <p className="text-gray-600 text-sm mb-6">
                Your trusted partner in finding the perfect home. Discover premium properties with our advanced search and filtering capabilities.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <ApperIcon name={social.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-primary transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2024 PropView. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-gray-600 hover:text-primary transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 hover:text-primary transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-600 hover:text-primary transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer