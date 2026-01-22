import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Menu } from '@headlessui/react'
import Avatar from './Avatar'
import { ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex-shrink-0 relative flex items-center justify-center">
              <img 
                src="/unpad.png" 
                alt="Logo UNPAD" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900">
                Sistem Ticket Pengaduan
              </h1>
              <p className="text-xs text-blue-900 font-medium">Universitas Padjadjaran</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors border border-gray-200">
                {user?.avatar ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000${user.avatar}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const fallback = document.createElement('div')
                      fallback.className = 'w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium text-white'
                      fallback.textContent = user?.name?.charAt(0)?.toUpperCase()
                      e.target.parentElement.insertBefore(fallback, e.target)
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{user?.name}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </Menu.Button>
              
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/app/profile"
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header