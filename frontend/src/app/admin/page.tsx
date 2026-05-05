'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { userApi, outletApi, regionApi } from '@/lib/api'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOutlets: 0,
    activeOutlets: 0,
    totalRegions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, outletsRes, regionsRes] = await Promise.all([
          userApi.getAll(),
          outletApi.getAll(),
          regionApi.getAll()
        ])

        if (usersRes.success) {
          const users = usersRes.data
          setStats(prev => ({
            ...prev,
            totalUsers: users.length,
            activeUsers: users.filter((u: any) => u.isActive).length
          }))
        }

        if (outletsRes.success) {
          const outlets = outletsRes.data
          setStats(prev => ({
            ...prev,
            totalOutlets: outlets.length,
            activeOutlets: outlets.filter((o: any) => o.isActive).length
          }))
        }

        if (regionsRes.success) {
          setStats(prev => ({
            ...prev,
            totalRegions: regionsRes.data.length
          }))
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          👋 Welcome, {user?.name}!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Admin Dashboard - Overview of your system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">👥</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{stats.totalUsers}</span>
          </div>
          <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Total Users</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stats.activeUsers} active</p>
        </div>

        {/* Outlets Card */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🏢</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{stats.totalOutlets}</span>
          </div>
          <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Total Outlets</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stats.activeOutlets} active</p>
        </div>

        {/* Regions Card */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🌍</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>{stats.totalRegions}</span>
          </div>
          <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Total Regions</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Geographic areas</p>
        </div>

        {/* Roles Card */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🔐</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>4</span>
          </div>
          <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>System Roles</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Customizable</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/users" className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <span className="text-2xl">➕</span>
            <span style={{ color: 'var(--text-primary)' }}>Add User</span>
          </a>
          <a href="/admin/outlets" className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <span className="text-2xl">🏢</span>
            <span style={{ color: 'var(--text-primary)' }}>Add Outlet</span>
          </a>
          <a href="/admin/regions" className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <span className="text-2xl">🌍</span>
            <span style={{ color: 'var(--text-primary)' }}>Add Region</span>
          </a>
          <a href="/admin/roles" className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <span className="text-2xl">🔐</span>
            <span style={{ color: 'var(--text-primary)' }}>Manage Roles</span>
          </a>
        </div>
      </div>
    </div>
  )
}
