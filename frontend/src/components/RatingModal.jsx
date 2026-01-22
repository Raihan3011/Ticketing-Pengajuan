import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import api from '../services/authService'
import toast from 'react-hot-toast'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

function RatingModal({ ticket, isOpen, onClose }) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const queryClient = useQueryClient()

  const ratingMutation = useMutation(
    async (data) => {
      const response = await api.post(`/tickets/${ticket.id}/rate`, data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', ticket.id])
        toast.success('Thank you for your feedback!')
        onClose()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit rating')
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    ratingMutation.mutate({ rating, feedback })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-2xl rounded-xl bg-white">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <StarIcon className="w-10 h-10 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Rating Pelayanan
          </h3>
          <p className="text-gray-600 text-sm">
            Bagaimana pengalaman Anda dengan penyelesaian pengaduan ini?
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Berikan Rating Anda
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transform transition-transform hover:scale-110"
                >
                  {star <= rating ? (
                    <StarIcon className="w-10 h-10 text-yellow-400 fill-current" />
                  ) : (
                    <StarOutlineIcon className="w-10 h-10 text-gray-300 hover:text-yellow-200" />
                  )}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-2 text-sm font-medium text-gray-700">
                {rating === 5 && '⭐ Sangat Puas'}
                {rating === 4 && '😊 Puas'}
                {rating === 3 && '😐 Cukup'}
                {rating === 2 && '😕 Kurang Puas'}
                {rating === 1 && '😞 Tidak Puas'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Tambahan (Opsional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="input"
              placeholder="Ceritakan pengalaman Anda atau saran untuk perbaikan..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={ratingMutation.isLoading}
              className="btn btn-primary flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {ratingMutation.isLoading ? 'Mengirim...' : 'Kirim Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RatingModal