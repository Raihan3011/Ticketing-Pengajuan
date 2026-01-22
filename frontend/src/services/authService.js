import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async sendOtp(data) {
    const response = await api.post('/register/send-otp', data)
    return response.data
  },

  async verifyOtp(data) {
    const response = await api.post('/register/verify-otp', data)
    return response.data
  },

  async login(credentials) {
    try {
      console.log('AuthService login request:', credentials)
      const response = await api.post('/login', credentials)
      console.log('AuthService login response:', response.data)
      return response.data
    } catch (error) {
      console.error('AuthService login error:', error.response?.data || error.message)
      throw error
    }
  },

  async logout() {
    const response = await api.post('/logout')
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/user')
    return response.data.user
  },

  async forgotPassword(email) {
    const response = await api.post('/forgot-password', { email })
    return response.data
  },

  async resetPassword(data) {
    const response = await api.post('/reset-password', data)
    return response.data
  },

  async updateProfile(data) {
    // Laravel requires _method for PUT with FormData
    if (data instanceof FormData) {
      data.append('_method', 'PUT')
    }
    const response = await api.post('/profile', data, {
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    })
    return response.data
  },

  async updatePassword(data) {
    const response = await api.put('/profile/password', data)
    return response.data
  }
}

export default api