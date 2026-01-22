import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'

function NotificationBadge({ count, onClick }) {
  if (!count || count === 0) return null

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
    >
      <BellIcon className="w-6 h-6" />
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {count > 99 ? '99+' : count}
      </span>
    </button>
  )
}

export default NotificationBadge
