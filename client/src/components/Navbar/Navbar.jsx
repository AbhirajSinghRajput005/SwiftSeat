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
    <nav className="fixed top-6 left-0 right-0 z-50 px-6 sm:px-8 lg:px-12 pointer-events-none">
      <div className="max-w-7xl mx-auto glass rounded-[32px] pointer-events-auto overflow-hidden">
        <div className="flex items-center justify-between h-20 px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-premium group-hover:rotate-6 transition-all duration-300">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="font-geist-black font-black text-2xl text-navy-charcoal tracking-tight">
              Swift<span className="text-gradient">Seat</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
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
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full hover:bg-white/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center border border-white group-hover:border-brand-500/30 transition-all">
                    <User className="w-5 h-5 text-brand-500" />
                  </div>
                  <span className="text-sm font-bold text-navy-charcoal">{user?.name}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-14 w-56 bg-white/95 backdrop-blur-xl rounded-[24px] shadow-elevated border border-white/40 py-2 animate-fade-in">
                    <div className="px-6 py-4 border-b border-surface-100">
                      <p className="text-sm font-black text-navy-charcoal">{user?.name}</p>
                      <p className="text-xs text-surface-500 font-medium">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/my-bookings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-navy-charcoal hover:bg-brand-50 hover:text-brand-500 transition-all"
                      >
                        <Ticket className="w-4 h-4" /> My Bookings
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false) }}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-error hover:bg-error-light/20 transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-6 py-2.5 text-sm font-black text-navy-charcoal hover:text-brand-500 transition-colors">Login</Link>
                <Link to="/register" className="btn-primary py-2.5 px-6 rounded-full text-sm shadow-premium">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-3 rounded-2xl bg-white/50 hover:bg-white transition-all shadow-sm"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6 text-navy-charcoal" /> : <Menu className="w-6 h-6 text-navy-charcoal" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20 animate-fade-in">
            <div className="p-6 space-y-2">
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
                  className="w-full text-left px-4 py-4 rounded-2xl text-error bg-error-light/10 font-black text-sm"
                >
                  Logout
                </button>
              ) : (
                <div className="flex gap-4 pt-4">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-4 rounded-2xl bg-white/50 font-black text-navy-charcoal">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center py-4 rounded-2xl">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        active
          ? 'text-brand-500 bg-white shadow-sm'
          : 'text-surface-600 hover:text-navy-charcoal hover:bg-white/50'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link to={to} onClick={onClick} className="block px-4 py-4 rounded-2xl text-navy-charcoal hover:bg-white transition-colors font-black text-sm">
      {children}
    </Link>
  )
}

