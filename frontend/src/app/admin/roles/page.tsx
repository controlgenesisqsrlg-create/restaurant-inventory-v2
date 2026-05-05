'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { roleApi, moduleApi } from '@/lib/api'

interface Role {
  id: string
  name: string
  description?: string
  isSystem: boolean
  userCount?: number
  modules?: any[]
  permissions?: any[]
}

interface Module {
  id: string
  name: string
  displayName: string
  icon?: string
  permissions?: any[]
}

export default function RolesPage() {
  const { user } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isSystem: false
  })
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<{ moduleId: string; action: string }[]>([])

  const actions = ['create', 'read', 'update', 'delete', 'approve', 'verify', 'export']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [rolesRes, modulesRes] = await Promise.all([
        roleApi.getAll(),
        moduleApi.getAll()
      ])

      if (rolesRes.success) setRoles(rolesRes.data)
      if (modulesRes.success) setModules(modulesRes.data)
    } catch (error) {
      console.error('Error fetching ', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingRole) {
        await roleApi.update(editingRole.id, {
          name: formData.name,
          description: formData.description
        })
        alert('✅ Role updated successfully!')
      } else {
        await roleApi.create(formData)
        alert('✅ Role created successfully!')
      }
      
      setShowModal(false)
      setEditingRole(null)
      setFormData({ name: '', description: '', isSystem: false })
      fetchData()
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.error || 'Operation failed'))
    }
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
      isSystem: role.isSystem
    })
    setShowModal(true)
  }

  const handleDelete = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role?.isSystem) {
      alert('❌ Cannot delete system roles')
      return
    }
    
    if (!confirm('Are you sure you want to delete this role? This cannot be undone.')) return
    
    try {
      await roleApi.delete(roleId)
      alert('✅ Role deleted successfully!')
      fetchData()
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.error || 'Delete failed'))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            🔐 Roles & Permissions
          </h1>
          <button
            onClick={() => {
              setEditingRole(null)
              setFormData({ name: '', description: '', isSystem: false })
              setShowModal(true)
            }}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
          >
            ➕ Add Role
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage user roles and module-based permissions
        </p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-6 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
                  {role.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{role.name}</h3>
                  {role.isSystem && (
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                      System Role
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {role.description || 'No description'}
            </p>

            <div className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                MODULES
              </p>
              <div className="flex flex-wrap gap-2">
                {role.modules?.slice(0, 4).map((module) => (
                  <span
                    key={module.id}
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}
                  >
                    {module.icon} {module.displayName}
                  </span>
                ))}
                {(role.modules?.length || 0) > 4 && (
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                    +{role.modules.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                👥 {role.userCount || 0} users
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="px-3 py-1 rounded text-sm"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                >
                  ✏️ Edit
                </button>
                {!role.isSystem && (
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="px-3 py-1 rounded text-sm"
                    style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-2xl p-6 rounded-xl m-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingRole ? '✏️ Edit Role' : '➕ Add Role'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl"
                style={{ color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Role Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="e.g., Manager"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="Describe this role's responsibilities..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
                >
                  {editingRole ? '💾 Update Role' : '➕ Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
