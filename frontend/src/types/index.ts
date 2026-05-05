export interface User {
  id: string
  name: string
  email: string
  roleId: string
  roleName?: string
  primaryOutletId?: string
  primaryOutletName?: string
  accessibleOutlets?: Outlet[]
  isActive: boolean
  permissions?: Permission[]
}

export interface Outlet {
  id: string
  name: string
  code: string
  regionId?: string
  regionName?: string
  address?: string
  phone?: string
  isActive: boolean
}

export interface Region {
  id: string
  name: string
  code: string
  _count?: {
    outlets: number
  }
}

export interface Role {
  id: string
  name: string
  description?: string
  isSystem: boolean
  userCount?: number
  modules?: Module[]
  permissions?: Permission[]
}

export interface Module {
  id: string
  name: string
  displayName: string
  icon?: string
  path?: string
}

export interface Permission {
  id: string
  moduleId: string
  module?: Module
  action: string
  description?: string
}

export interface LoginResponse {
  success: boolean
  user: User
  token: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
