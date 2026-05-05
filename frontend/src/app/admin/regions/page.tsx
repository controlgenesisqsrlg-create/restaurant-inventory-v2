'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { regionApi } from '@/lib/api'

interface Region {
  id: string
  name: string
  code: string
  _count?: {
    outlets: number
  }
}

export default function RegionsPage() {
  const { user } = useAuth()
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const regionsRes = await regionApi.getAll()
      if (regionsRes.success) setRegions(regionsRes.data)
    } catch (error) {
      console.error('Error fetching regions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingRegion) {
        await regionApi.update(editingRegion.id, formData)
        alert('✅ Region updated successfully!')
      } else {
        await regionApi.create(formData)
        alert('✅ Region created successfully!')
      }
      
      setShowModal(false)
      setEditingRegion(null)
      setFormData({ name: '', code: '' })
      fetchData()
    } catch (error: any) {
      alert('❌ ' + (error.response?.data?.error || 'Operation failed'))
    }
  }

  const handleEdit = (region: Region) => {
    setEditingRegion(region)
    setFormData({
      name: region.name,
      code: region.code
    })
    setShowModal(true)
  }

  const handleDelete = async (regionId: string) => {
    if (!confirm('Are you sure you want to delete this region? This cannot be undone.')) return
    
    try {
      await regionApi.delete(regionId)
      alert('✅ Region deleted successfully!')
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
            🌍 Region Management
          </h1>
          <button
            onClick={() => {
              setEditingRegion(null)
              setFormData({ name: '', code: '' })
              setShowModal(true)
            }}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
          >
            ➕ Add Region
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage geographic regions for outlet grouping
        </p>
      </div>

      {/* Regions Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Outlets</th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-primary)' }}>{region.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded text-sm font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                    {region.code}
                  </span>
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                  {region._count?.outlets || 0} outlet(s)
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(region)}
                      className="px-3 py-1 rounded text-sm"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(region.id)}
                      className="px-3 py-1 rounded text-sm"
                      style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
                    >
                      🗑️ Delete
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
          <div className="w-full max-w-md p-6 rounded-xl m-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingRegion ? '✏️ Edit Region' : '➕ Add Region'}
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
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Region Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="e.g., Lagos Region"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Region Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="e.g., LAG"
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
                  {editingRegion ? '💾 Update Region' : '➕ Create Region'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
