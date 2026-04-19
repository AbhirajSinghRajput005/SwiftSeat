import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bus, Mail, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, clearError, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
    return () => {
      if (error) clearError()
    }
  }, [isAuthenticated, navigate, from, clearError, error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (err) {
      // Error handled in context
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface-50 p-4">
      {/* Background Decorative Shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-100/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-100/50 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-white rounded-[2rem] shadow-elevated border border-surface-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mb-4 shadow-button shadow-brand-500/20">
                <Bus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-surface-900">Welcome Back</h1>
              <p className="text-surface-500 text-sm">Login to manage your bookings</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-light/30 border border-error-light rounded-xl flex items-center gap-3 text-error text-sm animate-bounce-soft">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-surface-600 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="input-field pl-12"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-surface-600 uppercase tracking-widest">Password</label>
                  <Link to="#" className="text-xs font-bold text-brand-500 hover:text-brand-600">Forgot?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-brand-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    className="input-field pl-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-surface-500 text-sm">
                New to SwiftSeat?{' '}
                <Link to="/register" className="font-bold text-brand-500 hover:text-brand-600 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Admin Quick Login (For Demo) */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button 
            onClick={() => { setEmail('admin@swiftseat.com'); setPassword('admin123') }}
            className="text-xs bg-surface-200 text-surface-600 px-3 py-1.5 rounded-full hover:bg-brand-50 hover:text-brand-500 transition-all font-medium"
          >
            Admin Demo
          </button>
          <button 
            onClick={() => { setEmail('user@swiftseat.com'); setPassword('user123') }}
            className="text-xs bg-surface-200 text-surface-600 px-3 py-1.5 rounded-full hover:bg-brand-50 hover:text-brand-500 transition-all font-medium"
          >
            User Demo
          </button>
        </div>
      </div>
    </div>
  )
}
