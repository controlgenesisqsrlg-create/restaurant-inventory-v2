'use client'

import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊', module: 'dashboard' },
  { name: 'Users', path: '/admin/users', icon: '👥', module: 'users' },
  { name: 'Outlets', path: '/admin/outlets', icon: '🏢', module: 'outlets' },
  { name: 'Regions', path: '/admin/regions', icon: '🌍', module: 'regions' },
  { name: 'Roles', path: '/admin/roles', icon: '🔐', module: 'roles' },
  { name: 'Inventory', path: '/inventory', icon: '📦', module: 'inventory' },
  { name: 'Requisitions', path: '/requisitions', icon: '📝', module: 'requisition' },
  { name: 'Issuance', path: '/issuance', icon: '🚚', module: 'issuance' },
  { name: 'EOD', path: '/eod', icon: '🌙', module: 'eod' },
  { name: 'Reports', path: '/reports', icon: '📊', module: 'reports' },
]

export default function Sidebar() {
  const { user, canViewModule, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          📦 Inventory
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {menuItems.map((item) => {
          // Hide module if user doesn't have permission
          if (!canViewModule(item.module)) return null

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                pathname === item.path ? 'bg-primary/10' : 'hover:bg-tertiary'
              }`}
              style={{
                backgroundColor: pathname === item.path ? 'var(--primary)' : 'transparent',
                color: pathname === item.path ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Theme Toggle */}
      <div className="absolute bottom-0 w-64 p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
          </span>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded text-sm"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          >
            Toggle
          </button>
        </div>
        
        <div className="mb-4">
          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
            {user?.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {user?.email}
          </p>
        </div>
        
        <button
          onClick={logout}
          className="w-full py-2 rounded text-sm"
          style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
        >
        🚪 Logout
        </button>
      </div>
    </div>
  )
}
