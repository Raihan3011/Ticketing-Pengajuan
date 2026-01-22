import React from 'react'
import { useQuery } from 'react-query'
import api from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

function Ratings() {
  const { data, isLoading } = useQuery('ratings', async () => {
    const response = await api.get('/ratings')
    return response.data
  })

  if (isLoading) return <LoadingSpinner />

  const ratings = data?.ratings || []
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratings.filter(r => r.rating === star).length,
    percentage: ratings.length > 0 ? (ratings.filter(r => r.rating === star).length / ratings.length * 100).toFixed(0) : 0
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rating Pelayanan</h1>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Rating Rata-rata</p>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-4xl font-bold text-yellow-600">{averageRating}</span>
              <StarIcon className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600 mb-2">Total Rating</p>
          <p className="text-3xl font-bold text-gray-900">{ratings.length}</p>
          <p className="text-sm text-gray-500 mt-1">rating diterima</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600 mb-2">Kepuasan Pelanggan</p>
          <p className="text-3xl font-bold text-green-600">
            {ratings.length > 0 
              ? ((ratings.filter(r => r.rating >= 4).length / ratings.length * 100).toFixed(0))
              : 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">rating ≥ 4 bintang</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Rating</h3>
        <div className="space-y-3">
          {ratingCounts.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-20">
                <span className="text-sm font-medium text-gray-700">{star}</span>
                <StarIcon className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-600 w-16 text-right">
                {count} ({percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Semua Rating</h3>
        {ratings.length === 0 ? (
          <div className="text-center py-12">
            <StarOutlineIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada rating</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      Tiket #{rating.ticket?.ticket_number}
                    </p>
                    <p className="text-sm text-gray-600">{rating.ticket?.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-5 h-5 ${
                            star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(rating.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                
                {rating.feedback && (
                  <div className="bg-gray-50 rounded p-3 border border-gray-200">
                    <p className="text-sm text-gray-700 italic">"{rating.feedback}"</p>
                  </div>
                )}
                
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Oleh: {rating.user?.name}</span>
                  <span>Staff: {rating.ticket?.assigned_user?.name || '-'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Ratings
