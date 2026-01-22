import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import AssignTicketModal from '../components/AssignTicketModal'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

function Tickets() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const handleCardClick = (ticketId, e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return
    }
    navigate(`/app/tickets/${ticketId}`)
  }
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    priority: ''
  })
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: '',
    status: '',
    category: '',
    priority: ''
  })
  const [assignModal, setAssignModal] = useState({ isOpen: false, ticket: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 500)
    return () => clearTimeout(timer)
  }, [filters])

  const { data: tickets, isLoading, error } = useQuery(
    ['tickets', debouncedFilters, currentPage, perPage],
    () => ticketService.getTickets({ ...debouncedFilters, page: currentPage, per_page: perPage }),
    { 
      keepPreviousData: true,
      onSuccess: (data) => {
        console.log('Tickets data:', data)
      },
      onError: (error) => {
        console.error('Tickets error:', error)
      }
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAssignTicket = async (userId) => {
    try {
      await ticketService.assignTicket(assignModal.ticket.id, userId)
      setAssignModal({ isOpen: false, ticket: null })
      // Refresh tickets
      window.location.reload()
    } catch (error) {
      console.error('Error assigning ticket:', error)
    }
  }

  const handleClaimTicket = async (ticketId) => {
    try {
      await ticketService.claimTicket(ticketId)
      window.location.reload()
    } catch (error) {
      console.error('Error claiming ticket:', error)
    }
  }

  const canAssign = user?.role?.name === 'admin' || user?.role?.name === 'supervisor' || user?.role?.name === 'pimpinan'
  const canClaim = user?.role?.name === 'staff' || user?.role?.name === 'teknisi'

  const getPriorityBorderColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'border-l-red-800'
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      default: return 'border-l-green-500'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading tickets: {error.message}</p>
      </div>
    )
  }

  console.log('Rendering tickets:', tickets)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
        {(user?.role?.name === 'pengadu' || user?.role?.name === 'admin' || user?.role?.name === 'pimpinan') && (
          <button 
            onClick={() => navigate('/app/tickets/create')} 
            className="btn btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Ticket
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="input pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <select
            className="input"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="1">Open</option>
            <option value="2">In Progress</option>
            <option value="3">Resolved</option>
            <option value="4">Closed</option>
          </select>
          <select
            className="input"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="1">IT Support</option>
            <option value="2">Hardware</option>
            <option value="3">Software</option>
            <option value="4">Network</option>
            <option value="5">General</option>
          </select>
          <select
            className="input"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Critical</option>
          </select>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">View:</label>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">tickets per page</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Showing {tickets?.data?.length ? ((currentPage - 1) * perPage) + 1 : 0} - {Math.min(currentPage * perPage, tickets?.total || 0)} of {tickets?.total || 0}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets?.data?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tickets found</p>
          </div>
        ) : (
          tickets?.data?.map((ticket) => {
            const createdDate = new Date(ticket.created_at)
            const dateString = createdDate.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
            
            return (
              <div 
                key={ticket.id} 
                className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer border-l-8 ${getPriorityBorderColor(ticket.priority?.name)}`}
                onClick={(e) => handleCardClick(ticket.id, e)}
              >
                <div className="flex items-stretch justify-between h-full">
                  {/* Left side - Date and Status */}
                  <div className="flex items-stretch space-x-6">
                    {/* Date Badge */}
                    <div className="flex flex-col justify-center items-center bg-gray-100 rounded-lg p-4 min-w-[120px]">
                      <div className="text-xs text-gray-500 mb-1">{ticket.ticket_number}</div>
                      <div className="text-lg font-bold text-gray-900">{dateString}</div>
                      <div className="mt-3">
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(ticket.status?.name)}`}>
                          {ticket.status?.name}
                        </span>
                      </div>
                    </div>
                    
                    {/* Ticket Info */}
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900 block mb-3">
                        {ticket.title}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        At {ticket.category?.name}
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
                        <div>
                          <div className="text-gray-500 font-medium mb-1">Requester</div>
                          <div className="text-gray-900">{ticket.requester?.name || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 font-medium mb-1">Priority</div>
                          <div className="text-gray-900">{ticket.priority?.name || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 font-medium mb-1">Assigned To</div>
                          <div className="text-gray-900">{ticket.assigned_user?.name || 'Unassigned'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 font-medium mb-1">ID Number</div>
                          <div className="text-gray-900">{ticket.id.toString().padStart(7, '0')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {canAssign && (
                      <button
                        onClick={() => setAssignModal({ isOpen: true, ticket })}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center"
                      >
                        <UserPlusIcon className="w-3 h-3 mr-1" />
                        {ticket.assigned_user ? 'Reassign' : 'Assign'}
                      </button>
                    )}
                    {canClaim && !ticket.assigned_user && (
                      <button
                        onClick={() => handleClaimTicket(ticket.id)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {tickets?.total > perPage && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.ceil((tickets?.total || 0) / perPage) }, (_, i) => i + 1)
              .filter(page => {
                const totalPages = Math.ceil((tickets?.total || 0) / perPage)
                if (totalPages <= 7) return true
                if (page === 1 || page === totalPages) return true
                if (page >= currentPage - 1 && page <= currentPage + 1) return true
                return false
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1]
                const showEllipsis = prevPage && page - prevPage > 1
                
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-3 py-1 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                )
              })
            }
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil((tickets?.total || 0) / perPage)))}
            disabled={currentPage >= Math.ceil((tickets?.total || 0) / perPage)}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <AssignTicketModal
        ticket={assignModal.ticket}
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false, ticket: null })}
        onAssign={handleAssignTicket}
      />
    </div>
  )
}

export default Tickets