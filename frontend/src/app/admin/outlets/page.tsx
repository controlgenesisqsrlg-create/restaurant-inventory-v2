'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { outletApi, regionApi } from '@/lib/api'

interface Outlet {
  id: string
  name: string
  code: string
  regionId?: string
  regionName?: string
  address?: string
  phone?: string
  isActive: boolean
}

interface Region {
  id: string
  name: string
}

export default function OutletsPage() {
  const { user } = useAuth()
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    regionId: '',
    address: '',
    phone: '',
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [outletsRes, regionsRes] = await Promise.all([
        outletApi.getAll(),
        regionApi.getAll()
      ])

      if (outletsRes.success) setOutlets(outletsRes.data)
      if (regionsRes.success) setRegions(regionsRes.data)
    } catch (error) {
      console.error('Error fetching ', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingOutlet) {
        await outletApi.update(editingOutlet.id, formData)
        alert('✅ Outlet updated successfully!')
      } else {
        await outletApi.create(formData)
        alert('✅ Outlet created successfully!')
      }
      
      setShowModal(false)
      setEditingOutlet(null)
      setFormData({
        name: '',
        code: '',
        regionId: '',
        address: '',
        phone: '',
        isActive: true
      })
      fetchData()
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.error || 'Operation failed'))
    }
  }

  const handleEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet)
    setFormData({
      name: outlet.name,
      code: outlet.code,
      regionId: outlet.regionId || '',
      address: outlet.address || '',
      phone: outlet.phone || '',
      isActive: outlet.isActive
    })
    setShowModal(true)
  }

  const handleToggleStatus = async (outletId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this outlet?`)) return
    
    try {
      await outletApi.update(outletId, { isActive: !currentStatus })
      alert('✅ Outlet status updated!')
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
            🏢 Outlet Management
          </h1>
          <button
            onClick={() => {
              setEditingOutlet(null)
              setFormData({
                name: '',
                code: '',
                regionId: '',
                address: '',
                phone: '',
                isActive: true
              })
              setShowModal(true)
            }}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
          >
            ➕ Add Outlet
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage restaurant outlets and locations
        </p>
      </div>

      {/* Outlets Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Region</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {outlets.map((outlet) => (
              <tr key={outlet.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-primary)' }}>{outlet.name}</td>
                <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{outlet.code}</td>
                <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{outlet.regionName || 'Unassigned'}</td>
                <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{outlet.address || '-'}</td>
                <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{outlet.phone || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${outlet.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {outlet.isActive ? '✅ Active' : '❌ Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(outlet)}
                      className="px-3 py-1 rounded text-sm"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(outlet.id, outlet.isActive)}
                      className="px-3 py-1 rounded text-sm"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                      {outlet.isActive ? '🚫 Deactivate' : '✅ Activate'}
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
                {editingOutlet ? '✏️ Edit Outlet' : '➕ Add Outlet'}
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
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Outlet Name *</label>
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
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Outlet Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Region</label>
                  <select
                    value={formData.regionId}
                    onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Unassigned</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
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
                  {editingOutlet ? '💾 Update Outlet' : '➕ Create Outlet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
