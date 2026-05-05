'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { userApi, roleApi, outletApi } from '@/lib/api'
import Header from '@/components/Header'

interface User {
  id: string
  name: string
  email: string
  roleId: string
  roleName?: string
  primaryOutletId?: string
  primaryOutletName?: string
  isActive: boolean
  createdAt: string
}

interface Role {
  id: string
  name: string
}

interface Outlet {
  id: string
  name: string
}

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    primaryOutletId: '',
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes, outletsRes] = await Promise.all([
        userApi.getAll(),
        roleApi.getAll(),
        outletApi.getAll()
      ])

      if (usersRes.success) setUsers(usersRes.data)
      if (rolesRes.success) setRoles(rolesRes.data)
      if (outletsRes.success) setOutlets(outletsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingUser) {
        await userApi.update(editingUser.id, formData)
        alert('✅ User updated successfully!')
      } else {
        await userApi.create(formData)
        alert('✅ User created successfully!')
      }
      
      setShowModal(false)
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        roleId: '',
        primaryOutletId: '',
        isActive: true
      })
      fetchData()
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.error || 'Operation failed'))
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      roleId: user.roleId,
      primaryOutletId: user.primaryOutletId || '',
      isActive: user.isActive
    })
    setShowModal(true)
  }

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return
    
    try {
      await userApi.update(userId, { isActive: !currentStatus })
      alert('✅ User status updated!')
      fetchData()
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.error || 'Update failed'))
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
            👥 User Management
          </h1>
          <button
            onClick={() => {
              setEditingUser(null)
              setFormData({
                name: '',
                email: '',
                password: '',
                roleId: '',
                primaryOutletId: '',
                isActive: true
              })
              setShowModal(true)
            }}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
          >
            ➕ Add User
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage system users, roles, and access
        </p>
      </div>

      {/* Users Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Primary Outlet</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</td>
                <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                    {user.roleName || 'No Role'}
                  </span>
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{user.primaryOutletName || 'Unassigned'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? '✅ Active' : '❌ Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 rounded text-sm"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                      className="px-3 py-1 rounded text-sm"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                      {user.isActive ? '🚫 Deactivate' : '✅ Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-2xl p-6 rounded-xl m-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingUser ? '✏️ Edit User' : '➕ Add User'}
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Password {!editingUser && '*'}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Role *</label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Primary Outlet</label>
                  <select
                    value={formData.primaryOutletId}
                    onChange={(e) => setFormData({ ...formData, primaryOutletId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Unassigned</option>
                    {outlets.map((outlet) => (
                      <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Status</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="true">✅ Active</option>
                    <option value="false">❌ Inactive</option>
                  </select>
                </div>
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
                  {editingUser ? '💾 Update User' : '➕ Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
