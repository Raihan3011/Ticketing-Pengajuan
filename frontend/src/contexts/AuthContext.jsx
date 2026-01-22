import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      const startTime = Date.now()
      const token = localStorage.getItem('token')
      
      try {
        if (token) {
          const user = await authService.getCurrentUser()
          dispatch({ type: 'SET_USER', payload: user })
        }
      } catch (error) {
        localStorage.removeItem('token')
        dispatch({ type: 'LOGOUT' })
      }
      

      const elapsedTime = Date.now() - startTime
      const minLoadingTime = 1500
      
      if (elapsedTime < minLoadingTime) {
        setTimeout(() => {
          dispatch({ type: 'SET_LOADING', payload: false })
        }, minLoadingTime - elapsedTime)
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      console.log('AuthContext login:', credentials)
      const response = await authService.login(credentials)
      console.log('AuthService response:', response)
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token)
        dispatch({ type: 'LOGIN_SUCCESS', payload: response })
        return response
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.clear()
      dispatch({ type: 'LOGOUT' })
    }
  }

  const register = async (data) => {
    const response = await authService.register(data)
    localStorage.setItem('token', response.token)
    dispatch({ type: 'LOGIN_SUCCESS', payload: response })
    return response
  }

  const updateUser = (user) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const value = {
    ...state,
    login,
    logout,
    register,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}