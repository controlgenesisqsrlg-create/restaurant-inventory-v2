'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { authApi } from '@/lib/api'
import { User, Outlet } from '@/types'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  token: string | null
  currentOutlet: Outlet | null
  accessibleOutlets: Outlet[]
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchOutlet: (outletId: string) => void
  hasPermission: (module: string, action: string) => boolean
  canViewModule: (module: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [currentOutlet, setCurrentOutlet] = useState<Outlet | null>(null)
  const [accessibleOutlets, setAccessibleOutlets] = useState<Outlet[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = Cookies.get('auth_token')
      const storedUser = localStorage.getItem('user')
      const storedOutlet = localStorage.getItem('currentOutlet')
      const storedOutlets = localStorage.getItem('accessibleOutlets')

      if (storedToken && storedUser) {
        try {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          if (storedOutlet) setCurrentOutlet(JSON.parse(storedOutlet))
          if (storedOutlets) setAccessibleOutlets(JSON.parse(storedOutlets))
          
          const response = await authApi.getCurrentUser()
          if (!response.success) throw new Error('Token invalid')
        } catch (error) {
          Cookies.remove('auth_token')
          localStorage.removeItem('user')
          localStorage.removeItem('currentOutlet')
          localStorage.removeItem('accessibleOutlets')
          setUser(null)
          setToken(null)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)
      if (response.success) {
        const { user: userData, token: authToken } = response
        Cookies.set('auth_token', authToken, { expires: 7 })
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('accessibleOutlets', JSON.stringify(userData.accessibleOutlets || []))
        setToken(authToken)
        setUser(userData)
        setAccessibleOutlets(userData.accessibleOutlets || [])
        
        const primaryOutlet = userData.accessibleOutlets?.find(
          o => o.id === userData.primaryOutletId
        ) || userData.accessibleOutlets?.[0]
        
        if (primaryOutlet) {
          setCurrentOutlet(primaryOutlet)
          localStorage.setItem('currentOutlet', JSON.stringify(primaryOutlet))
        }
        
        if (userData.roleName?.toLowerCase().includes('admin')) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  }

  const logout = () => {
    Cookies.remove('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('currentOutlet')
    localStorage.removeItem('accessibleOutlets')
    localStorage.removeItem('theme')
    setUser(null)
    setToken(null)
    setCurrentOutlet(null)
    setAccessibleOutlets([])
    router.push('/')
  }

  const switchOutlet = (outletId: string) => {
    const outlet = accessibleOutlets.find(o => o.id === outletId)
    if (outlet) {
      setCurrentOutlet(outlet)
      localStorage.setItem('currentOutlet', JSON.stringify(outlet))
    }
  }

  const hasPermission = (module: string, action: string): boolean => {
    if (!user?.permissions) return false
    if (user.roleName?.toLowerCase().includes('admin')) return true
    return user.permissions.some(p => p.module === module && p.action === action)
  }

  const canViewModule = (module: string): boolean => {
    if (!user?.permissions) return false
    if (user.roleName?.toLowerCase().includes('admin')) return true
    return user.permissions.some(p => p.module === module)
  }

  return (
    <AuthContext.Provider value={{ user, token, currentOutlet, accessibleOutlets, loading, login, logout, switchOutlet, hasPermission, canViewModule }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
