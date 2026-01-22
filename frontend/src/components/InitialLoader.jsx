import React from 'react'

function InitialLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="text-center">

        <div className="mb-8 flex flex-col items-center">
          <img 
            src="/unpad.png" 
            alt="UNPAD Logo" 
            className="w-20 h-20 mb-4 animate-pulse object-cover"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Sistem Ticketing UNPAD
          </h1>
          <p className="text-gray-600">Memuat aplikasi...</p>
        </div>

        <div className="flex justify-center items-center space-x-2 mb-8">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InitialLoader