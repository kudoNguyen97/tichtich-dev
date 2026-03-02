import axios from 'axios'
import type { AxiosError } from 'axios'
import { config } from '@/constants/config'

export const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach token
axiosInstance.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`
  }
  return requestConfig
})

// Response interceptor — handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
