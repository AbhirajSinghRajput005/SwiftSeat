import { Link } from 'react-router-dom'
import { Bus, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-white">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl">
                Swift<span className="text-brand-400">Seat</span>
              </span>
            </Link>
            <p className="text-surface-500 text-sm leading-relaxed">
              India's smartest bus ticket booking platform. Compare prices, choose your seats, and book in seconds.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/search">Search Buses</FooterLink>
              <FooterLink to="/my-bookings">My Bookings</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <FooterLink to="#">Help Center</FooterLink>
              <FooterLink to="#">Cancellation Policy</FooterLink>
              <FooterLink to="#">Terms & Conditions</FooterLink>
              <FooterLink to="#">Privacy Policy</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-surface-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@swiftseat.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Hyderabad, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-surface-800">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-surface-600">
            © {new Date().getFullYear()} SwiftSeat. All rights reserved.
          </p>
          <p className="text-xs text-surface-600">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-sm text-surface-500 hover:text-brand-400 transition-colors">
        {children}
      </Link>
    </li>
  )
}
