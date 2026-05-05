import axios from 'axios'
import Cookies from 'js-cookie'
import { ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add token to every request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('auth_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/login', {
      email,
      password
    })
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

// User APIs
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
  },
  
  addOutletAccess: async (userId: string, outletId: string) => {
    const response = await api.post<ApiResponse<any>>('/users/outlet-access', {
      userId,
      outletId
    })
    return response.data
  },
  
  removeOutletAccess: async (userId: string, outletId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/users/${userId}/outlet-access/${outletId}`)
    return response.data
  }
}

// Outlet APIs
export const outletApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/outlets')
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/outlets/${id}`)
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

// Region APIs
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

// Role APIs
export const roleApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/roles')
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/roles/${id}`)
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
  },
  
  assignModule: async (roleId: string, moduleId: string) => {
    const response = await api.post<ApiResponse<void>>('/roles/modules', {
      roleId,
      moduleId
    })
    return response.data
  },
  
  removeModule: async (roleId: string, moduleId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/roles/${roleId}/modules/${moduleId}`)
    return response.data
  },
  
  assignPermission: async (roleId: string, permissionId: string) => {
    const response = await api.post<ApiResponse<void>>('/roles/permissions', {
      roleId,
      permissionId
    })
    return response.data
  },
  
  removePermission: async (roleId: string, permissionId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/roles/${roleId}/permissions/${permissionId}`)
    return response.data
  }
}

// Module APIs
export const moduleApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/modules')
    return response.data
  }
}

export default api
