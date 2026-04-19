import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, User, Mail, Phone, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [validationError, setValidationError] = useState('')
  const { register, error, clearError, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
    return () => {
      if (error) clearError()
    }
  }, [isAuthenticated, navigate, clearError, error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')

    if (formData.password !== formData.confirmPassword) {
      return setValidationError('Passwords do not match')
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })
    } catch (err) {
      // Error handled in context
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface-50 p-4">
      {/* Background Decorative Shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-100/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-100/50 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-lg animate-scale-in">
        <div className="bg-white rounded-[2rem] shadow-elevated border border-surface-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mb-4 shadow-button shadow-brand-500/20">
                <Bus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-surface-900">Create Account</h1>
              <p className="text-surface-500 text-sm">Join SwiftSeat for exclusive travel benefits</p>
            </div>

            {(error || validationError) && (
              <div className="mb-6 p-4 bg-error-light/30 border border-error-light rounded-xl flex items-center gap-3 text-error text-sm animate-bounce-soft">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error || validationError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-surface-600 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      required
                      className="input-field pl-12"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-surface-600 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      className="input-field pl-12"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="input-field pl-12"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-surface-600 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      className="input-field pl-12"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-surface-600 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      className="input-field pl-12"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-surface-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-brand-500 hover:text-brand-600 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
