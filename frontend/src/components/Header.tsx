'use client'

import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

export default function Header() {
  const { user, currentOutlet, accessibleOutlets, switchOutlet } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
      {/* Outlet Selector */}
      {accessibleOutlets.length > 1 && (
        <div className="flex items-center gap-4">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            🏢 Outlet:
          </label>
          <select
            value={currentOutlet?.id || ''}
            onChange={(e) => switchOutlet(e.target.value)}
            className="px-4 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {accessibleOutlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg text-sm"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {user?.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {user?.roleName}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
