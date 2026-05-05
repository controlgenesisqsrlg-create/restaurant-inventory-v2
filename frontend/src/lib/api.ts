import axios from 'axios'
import Cookies from 'js-cookie'
import { ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/login', { email, password })
    return response.data
  },
  logout: async () => {
    const response = await api.post<ApiResponse<void>>('/auth/logout')
    return response.data
  },
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<any>>('/auth/me')
    return response.data
  }
}

export const userApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/users')
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/users/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/users', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/users/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`)
    return response.data
  }
}

export const outletApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/outlets')
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/outlets', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/outlets/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/outlets/${id}`)
    return response.data
  }
}

export const regionApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/regions')
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/regions', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/regions/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/regions/${id}`)
    return response.data
  }
}

export const roleApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/roles')
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/roles', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/roles/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/roles/${id}`)
    return response.data
  }
}

export const moduleApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/modules')
    return response.data
  }
}

export default api
