import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  HomeIcon,
  UsersIcon,
  PlusIcon,
  ChartBarIcon,
  BookOpenIcon,
  TicketIcon,
  StarIcon,
  Bars3Icon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

function Sidebar({ isExpanded, toggleSidebar }) {
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon, roles: ['admin', 'pengadu', 'staff', 'staff_support', 'supervisor', 'teknisi', 'pimpinan'] },
    { name: 'Tiket', href: '/app/tickets', icon: TicketIcon, roles: ['admin', 'pengadu', 'staff', 'staff_support', 'supervisor', 'teknisi', 'pimpinan'] },
    { name: 'Basis Pengetahuan', href: '/app/knowledge-base', icon: BookOpenIcon, roles: ['admin', 'pengadu', 'staff', 'staff_support', 'supervisor', 'teknisi'] },
    { name: 'Rating', href: '/app/ratings', icon: StarIcon, roles: ['admin', 'supervisor', 'pimpinan'] },
    { name: 'Pengguna', href: '/app/users', icon: UsersIcon, roles: ['admin'] },
    { name: 'Laporan', href: '/app/reports', icon: ChartBarIcon, roles: ['admin', 'supervisor', 'pimpinan'] },
  ]

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.role?.name)
  )

  return (
    <div className={`bg-[#1e3a8a] ${isExpanded ? 'w-48' : 'w-16'} min-h-screen fixed left-0 top-0 z-40 flex flex-col py-6 transition-all duration-300`}>
      {/* Toggle Button */}
      <div className={`${isExpanded ? 'px-4' : 'px-2'} mb-8`}>
        <button
          onClick={toggleSidebar}
          className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
        >
          <Bars3Icon className="w-6 h-6 text-white" />
          {isExpanded && <span className="ml-2 text-white font-medium">Menu</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 flex flex-col space-y-4 w-full ${isExpanded ? 'px-4' : 'px-2'}`}>
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center ${isExpanded ? 'space-x-3 px-4' : 'justify-center'} h-10 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            {isExpanded && <span className="font-medium">{item.name}</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
