import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, Menu, X, User, LogOut, Shield, Ticket } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-400/50 shadow-navbar">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-surface-900">
              Swift<span className="text-brand-500">Seat</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" active={isActive('/my-bookings')}>My Bookings</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" active={isActive('/admin')}>
                <Shield className="w-4 h-4" /> Admin
              </NavLink>
            )}
          </div>

          {/* Auth buttons / User menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-button hover:bg-surface-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-600" />
                  </div>
                  <span className="text-sm font-medium text-surface-800">{user?.name}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-card shadow-elevated border border-surface-400/50 py-1 animate-scale-in">
                    <div className="px-4 py-2 border-b border-surface-400/50">
                      <p className="text-sm font-medium text-surface-900">{user?.name}</p>
                      <p className="text-xs text-surface-600">{user?.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors"
                    >
                      <Ticket className="w-4 h-4" /> My Bookings
                    </Link>
                    <button
                      onClick={() => { logout(); setProfileOpen(false) }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error hover:bg-error-light/50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-200 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-400/50 bg-white animate-fade-in">
          <div className="section-container py-4 space-y-2">
            <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
            {isAuthenticated && (
              <MobileLink to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</MobileLink>
            )}
            {isAdmin && (
              <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</MobileLink>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="w-full text-left px-4 py-3 rounded-lg text-error hover:bg-error-light/50 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 text-center text-sm">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'text-brand-500 bg-brand-50'
          : 'text-surface-700 hover:text-brand-500 hover:bg-surface-100'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link to={to} onClick={onClick} className="block px-4 py-3 rounded-lg text-surface-700 hover:bg-surface-100 transition-colors font-medium">
      {children}
    </Link>
  )
}
