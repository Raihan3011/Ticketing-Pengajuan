import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import RatingModal from '../components/RatingModal'
import AssignTicketModal from '../components/AssignTicketModal'
import WorkflowTimeline from '../components/WorkflowTimeline'
import { 
  PaperClipIcon, 
  ChatBubbleLeftIcon,
  StarIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

function TicketDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showReportForm, setShowReportForm] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: ticketData, isLoading } = useQuery(
    ['ticket', id],
    () => ticketService.getTicket(id)
  )

  const { data: commentsData } = useQuery(
    ['ticket-comments', id],
    () => ticketService.getComments(id)
  )

  const addCommentMutation = useMutation(
    (data) => ticketService.addComment(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket-comments', id])
        reset()
        setShowCommentForm(false)
        toast.success('Comment added successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add comment')
      }
    }
  )

  const submitReportMutation = useMutation(
    (data) => ticketService.submitReport(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', id])
        reset()
        setShowReportForm(false)
        toast.success('Laporan berhasil dikirim ke pimpinan')
      },
      onError: (error) => {
        toast.error('Gagal mengirim laporan')
      }
    }
  )

  const approveReportMutation = useMutation(
    () => ticketService.approveReport(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', id])
        toast.success('Laporan telah disetujui, tiket berhasil diselesaikan')
      },
      onError: (error) => {
        toast.error('Gagal menyetujui laporan')
      }
    }
  )

  const onSubmitComment = (data) => {
    addCommentMutation.mutate(data)
  }

  const onSubmitReport = (data) => {
    submitReportMutation.mutate(data)
  }

  const handleApproveReport = () => {
    approveReportMutation.mutate()
  }

  const handleAssignTicket = async (userId) => {
    try {
      await ticketService.assignTicket(ticket.id, userId)
      setShowAssignModal(false)
      queryClient.invalidateQueries(['ticket', id])
      toast.success('Ticket assigned successfully')
    } catch (error) {
      toast.error('Failed to assign ticket')
    }
  }

  const handleClaimTicket = async () => {
    try {
      await ticketService.claimTicket(ticket.id)
      queryClient.invalidateQueries(['ticket', id])
      toast.success('Ticket claimed successfully')
    } catch (error) {
      toast.error('Failed to claim ticket')
    }
  }

  const updateStatusMutation = useMutation(
    (statusId) => ticketService.updateTicket(id, { status_id: statusId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticket', id])
        toast.success('Status updated successfully')
      },
      onError: (error) => {
        toast.error('Failed to update status')
      }
    }
  )

  const handleStatusChange = (statusId) => {
    updateStatusMutation.mutate(statusId)
  }

  if (isLoading) return <LoadingSpinner />

  const ticket = ticketData?.ticket
  const canRate = user?.role?.name === 'pengadu' && 
                  ticket?.requester_id === user?.id && 
                  ticket?.status?.name === 'Completed'
  const isStaff = user?.role?.name === 'staff_support'
  const isPimpinan = user?.role?.name === 'pimpinan'
  const canAssign = user?.role?.name === 'admin' || user?.role?.name === 'supervisor' || isPimpinan
  
  // Semua staff bisa mengerjakan tiket yang sudah di-assign
  const isAssignedToMe = isStaff && Number(ticket?.assigned_to) === Number(user?.id)
  const canUpdateStatus = isStaff && ticket?.assigned_to && Number(ticket?.assigned_to) === Number(user?.id) && (ticket?.status?.name === 'Pending' || ticket?.status?.name === 'Open')
  const canClaim = isStaff && !ticket?.assigned_to
  const canNotifyPimpinan = isStaff && ticket?.assigned_to && ticket?.assigned_to_pimpinan_id && !ticket?.pimpinan_notified_at && ticket?.status?.name === 'In Progress'
  const canApprovePimpinan = isPimpinan && ticket?.status?.name === 'In Progress' && ticket?.pimpinan_notified_at
  const canCompleteStaff = isStaff && ticket?.assigned_to && ticket?.pimpinan_approved_at && ticket?.status?.name !== 'Completed' && ticket?.status?.name !== 'Closed'



  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'in progress': return 'bg-yellow-100 text-yellow-800'
      case 'approved by pimpinan': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-600 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isImageFile = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
    return imageExtensions.some(ext => filename?.toLowerCase().endsWith(ext))
  }

  const getFullUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `http://localhost:8000${url.startsWith('/') ? url : '/' + url}`
  }

  const handleViewImage = (url) => {
    const fullUrl = getFullUrl(url)
    setSelectedImage(fullUrl)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Ticket Header */}
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600">{ticket?.ticket_number}</span>
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(ticket?.status?.name)}`}>
                {ticket?.status?.name}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(ticket?.priority?.name)}`}>
                {ticket?.priority?.name}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket?.title}</h1>
          </div>
          <div className="flex space-x-2">
            {canRate && (
              <button
                onClick={() => setShowRatingModal(true)}
                className="btn btn-primary text-sm"
              >
                <StarIcon className="w-4 h-4 mr-1" />
                Rating
              </button>
            )}
            {canAssign && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="btn btn-primary text-sm"
              >
                <UserPlusIcon className="w-4 h-4 mr-1" />
                {ticket?.assigned_user ? 'Reassign' : 'Assign'}
              </button>
            )}
            {canClaim && (
              <button
                onClick={handleClaimTicket}
                className="btn btn-primary text-sm"
              >
                <UserPlusIcon className="w-4 h-4 mr-1" />
                Claim
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
          <div>
            <p className="text-gray-600">Requester</p>
            <p className="font-medium text-gray-900">{ticket?.requester?.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Assigned To</p>
            <p className="font-medium text-gray-900">{ticket?.assigned_user?.name || 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-gray-600">Ditujukan Kepada</p>
            <p className="font-medium text-gray-900">{ticket?.pimpinan?.name || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <p className="font-medium text-gray-900">{ticket?.category?.name}</p>
          </div>
        </div>
      </div>

      {/* Staff Actions */}
      {canUpdateStatus && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mulai Mengerjakan Tiket</h3>
          <button
            onClick={() => handleStatusChange(2)}
            className="btn btn-primary"
          >
            Mulai Mengerjakan (In Progress)
          </button>
        </div>
      )}

      {/* Staff Notify Pimpinan */}
      {canNotifyPimpinan && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Beritahu Pimpinan</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800">
              Tiket ini perlu diberitahukan kepada pimpinan: <strong>{ticket?.pimpinan?.name}</strong>
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                await ticketService.notifyPimpinan(ticket.id)
                queryClient.invalidateQueries(['ticket', id])
                toast.success('Pimpinan berhasil diberitahu')
              } catch (error) {
                toast.error('Gagal memberitahu pimpinan')
              }
            }}
            className="btn btn-primary"
          >
            Beritahu Pimpinan
          </button>
        </div>
      )}

      {/* Pimpinan Approval */}
      {canApprovePimpinan && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Approve Pengaduan</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">
              Staff telah memberitahu Anda tentang pengaduan ini. Silakan review dan approve untuk melanjutkan proses.
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                await ticketService.approvePimpinan(ticket.id)
                queryClient.invalidateQueries(['ticket', id])
                toast.success('Pengaduan berhasil di-approve')
              } catch (error) {
                toast.error('Gagal approve pengaduan')
              }
            }}
            className="btn btn-primary"
          >
            Approve Pengaduan
          </button>
        </div>
      )}

      {/* Staff Complete */}
      {canCompleteStaff && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi Penyelesaian</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800">
              Pimpinan telah meng-approve pengaduan ini. Silakan konfirmasi penyelesaian.
            </p>
          </div>
          {!showReportForm ? (
            <button
              onClick={() => setShowReportForm(true)}
              className="btn btn-primary"
            >
              Konfirmasi Selesai
            </button>
          ) : (
            <form onSubmit={handleSubmit(async (data) => {
              try {
                await ticketService.completeByStaff(ticket.id, { completion_notes: data.completion_notes })
                queryClient.invalidateQueries(['ticket', id])
                reset()
                setShowReportForm(false)
                toast.success('Tiket berhasil diselesaikan')
              } catch (error) {
                toast.error('Gagal menyelesaikan tiket')
              }
            })} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Penyelesaian *
                </label>
                <textarea
                  {...register('completion_notes', { required: 'Catatan harus diisi' })}
                  rows={6}
                  className="input"
                  placeholder="Jelaskan hasil penyelesaian pengaduan ini..."
                />
                {errors.completion_notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.completion_notes.message}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Selesaikan Tiket
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Workflow Timeline */}
      <WorkflowTimeline ticket={ticket} />

      {/* Description */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket?.description}</p>
        
        {ticket?.completion_notes && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Catatan Penyelesaian:</h4>
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.completion_notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <StarIconSolid className="w-5 h-5 text-yellow-500 mr-2" />
          Rating Pelayanan
        </h3>
        
        {ticket?.rating ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`w-6 h-6 ${
                      star <= ticket.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {ticket.rating}/5
              </span>
            </div>
            
            {ticket?.feedback && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600 italic">"{ticket.feedback}"</p>
              </div>
            )}
          </div>
        ) : ticket?.status?.name === 'Completed' ? (
          canRate ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Berikan rating untuk membantu kami meningkatkan pelayanan.
              </p>
              <button
                onClick={() => setShowRatingModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                <StarIconSolid className="w-4 h-4" />
                <span>Berikan Rating</span>
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Belum ada rating</p>
          )
        ) : (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Rating dapat diberikan setelah tiket selesai (Completed)
            </p>
          </div>
        )}
      </div>

      {/* Attachments */}
      {ticket?.attachments?.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Attachments ({ticket.attachments.length})</h3>
          <div className="space-y-3">
            {ticket.attachments.map((attachment) => {
              const fullUrl = getFullUrl(attachment.url)
              return (
                <div key={attachment.id} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <PaperClipIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{attachment.original_name}</span>
                      <span className="text-xs text-gray-500">({attachment.formatted_size})</span>
                    </div>
                    <a
                      href={fullUrl}
                      download={attachment.original_name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Download
                    </a>
                  </div>
                  {isImageFile(attachment.original_name) && (
                    <div className="mt-2">
                      <img 
                        src={fullUrl} 
                        alt={attachment.original_name}
                        className="w-32 h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleViewImage(attachment.url)}
                        onError={(e) => {
                          console.error('Failed to load image:', fullUrl)
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Klik untuk memperbesar</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold"
            >
              ✕ Close
            </button>
            <img 
              src={selectedImage} 
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Comments</h3>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="btn btn-primary"
          >
            <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
            Add Comment
          </button>
        </div>

        {/* Comment Form */}
        {showCommentForm && (
          <form onSubmit={handleSubmit(onSubmitComment)} className="mb-6 p-4 bg-gray-50 rounded">
            <div className="mb-4">
              <textarea
                {...register('comment', { required: 'Comment is required' })}
                rows={4}
                className="input"
                placeholder="Add your comment..."
              />
              {errors.comment && (
                <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
              )}
            </div>
            
            {(user?.role?.name !== 'pengadu') && (
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    {...register('is_internal')}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Internal comment (not visible to customer)</span>
                </label>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addCommentMutation.isLoading}
                className="btn btn-primary"
              >
                {addCommentMutation.isLoading ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {commentsData?.comments?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          ) : (
            commentsData?.comments?.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{comment.user?.name}</span>
                    {comment.is_internal && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Internal
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      <RatingModal 
        ticket={ticket}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
      
      <AssignTicketModal
        ticket={ticket}
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignTicket}
      />
    </div>
  )
}

export default TicketDetail