import React from 'react'

function Avatar({ user, size = 'md', className = '' }) {
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-2xl'
  }

  const avatarUrl = user?.avatar ? `/storage/${user.avatar}` : null

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full flex items-center justify-center overflow-hidden`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.name || 'User'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div 
        className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}
      >
        {getInitials(user?.name)}
      </div>
    </div>
  )
}

export default Avatar