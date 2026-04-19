import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('swiftseat_token'),
  loading: true,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null }
    case 'AUTH_LOADED':
      return { ...state, user: action.payload, loading: false }
    case 'AUTH_ERROR':
      return { ...state, user: null, token: null, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false, error: null }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('swiftseat_token')
      if (token) {
        try {
          const user = await authService.getProfile()
          dispatch({ type: 'AUTH_LOADED', payload: user })
        } catch {
          localStorage.removeItem('swiftseat_token')
          dispatch({ type: 'AUTH_ERROR', payload: null })
        }
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: null })
      }
    }
    loadUser()
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('swiftseat_token', data.token)
      dispatch({ type: 'AUTH_SUCCESS', payload: data })
      return data
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'AUTH_ERROR', payload: msg })
      throw error
    }
  }, [])

  const register = useCallback(async (userData) => {
    try {
      const data = await authService.register(userData)
      localStorage.setItem('swiftseat_token', data.token)
      dispatch({ type: 'AUTH_SUCCESS', payload: data })
      return data
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'AUTH_ERROR', payload: msg })
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('swiftseat_token')
    dispatch({ type: 'LOGOUT' })
  }, [])

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), [])

  const value = useMemo(() => ({
    ...state,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin',
    login,
    register,
    logout,
    clearError,
  }), [state, login, register, logout, clearError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
