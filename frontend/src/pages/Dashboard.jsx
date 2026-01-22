import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import SlaAlerts from '../components/SlaAlerts'
import SupervisorDashboard from './SupervisorDashboard'
import ExecutiveDashboard from './ExecutiveDashboard'
import { 
  TicketIcon, 
  UserGroupIcon, 
  ClockIcon, 
  CheckCircleIcon,
  BellAlertIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedTickets, setSelectedTickets] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  
  // Role-specific dashboard routing
  if (user?.role?.name === 'supervisor') {
    return <SupervisorDashboard />
  }
  
  if (user?.role?.name === 'pimpinan') {
    return <ExecutiveDashboard />
  }
  
  const { data: dashboardData, isLoading } = useQuery(
    'dashboard',
    async () => {
      const response = await api.get('/dashboard')
      return response.data
    }
  )

  const { data: tickets, isLoading: ticketsLoading } = useQuery(
    ['tickets', filterStatus, filterPriority],
    async () => {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterPriority !== 'all') params.append('priority', filterPriority)
      const response = await api.get(`/tickets?${params.toString()}`)
      return response.data
    }
  )

  const closeTicketMutation = useMutation(
    async (ticketIds) => {
      await Promise.all(
        ticketIds.map(id => 
          api.patch(`/tickets/${id}`, { status_id: 4 }) // 4 = Closed
        )
      )
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tickets')
        queryClient.invalidateQueries('dashboard')
        setSelectedTickets([])
        alert('Tiket berhasil ditutup')
      }
    }
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value || 0}</p>
        </div>
      </div>
    </div>
  )

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTickets(tickets?.data?.map(t => t.id) || [])
    } else {
      setSelectedTickets([])
    }
  }

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    )
  }

  const handleCloseSelected = () => {
    if (selectedTickets.length === 0) {
      alert('Pilih tiket terlebih dahulu')
      return
    }
    if (confirm(`Tutup ${selectedTickets.length} tiket yang dipilih?`)) {
      closeTicketMutation.mutate(selectedTickets)
    }
  }

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`)
  }

  const renderAdminDashboard = () => (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Semua tiket aktif</span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                {tickets?.data?.length || 0}
              </span>
              {selectedTickets.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {selectedTickets.length} dipilih
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="border border-gray-300 rounded px-3 py-1 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="1">Open</option>
                <option value="2">In Progress</option>
                <option value="3">Resolved</option>
                <option value="4">Closed</option>
              </select>
              <select 
                className="border border-gray-300 rounded px-3 py-1 text-sm"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">Semua Prioritas</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Critical</option>
              </select>
              <button 
                className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                onClick={handleCloseSelected}
                disabled={selectedTickets.length === 0 || closeTicketMutation.isLoading}
              >
                {closeTicketMutation.isLoading ? 'Menutup...' : 'Tutup Tiket'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="bg-white">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="col-span-1">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={selectedTickets.length === tickets?.data?.length && tickets?.data?.length > 0}
                  onChange={handleSelectAll}
                />
              </div>
              <div className="col-span-1">ID</div>
              <div className="col-span-2">Pemohon</div>
              <div className="col-span-2">Prioritas</div>
              <div className="col-span-3">Subjek</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Aksi</div>
            </div>

            {ticketsLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : tickets?.data?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Tidak ada tiket ditemukan
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {tickets?.data?.map((ticket) => (
                  <div key={ticket.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                    <div className="col-span-1">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={() => handleSelectTicket(ticket.id)}
                      />
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm font-medium text-gray-900">#{ticket.id}</span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {ticket.requester?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ticket.requester?.name}</p>
                          <p className="text-xs text-gray-500">{ticket.requester?.role?.display_name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        ticket.priority?.name === 'Critical' ? 'bg-red-100 text-red-800' :
                        ticket.priority?.name === 'High' ? 'bg-orange-100 text-orange-800' :
                        ticket.priority?.name === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority?.name}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                      <p className="text-xs text-gray-500 truncate">{ticket.ticket_number}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.status?.name === 'Open' ? 'bg-green-100 text-green-800' :
                        ticket.status?.name === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status?.name === 'Resolved' ? 'bg-purple-100 text-purple-800' :
                        ticket.status?.name === 'Closed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.status?.name}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => handleTicketClick(ticket.id)}
                      >
                        Lihat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Statistik</h4>
            <ChartBarIcon className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-blue-100 font-medium">Total Tiket</p>
              <TicketIcon className="w-5 h-5 text-blue-200" />
            </div>
            <p className="text-3xl font-bold text-white">{dashboardData?.total_tickets || 0}</p>
            <div className="flex items-center mt-2">
              <ArrowTrendingUpIcon className="w-3 h-3 text-blue-200 mr-1" />
              <p className="text-xs text-blue-200">+12% dari bulan lalu</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-700">Terbuka</span>
                <span className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                  {dashboardData?.open_tickets || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{width: `${((dashboardData?.open_tickets || 0) / (dashboardData?.total_tickets || 1)) * 100}%`}}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-700">Dalam Proses</span>
                <span className="bg-yellow-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                  {dashboardData?.tickets_by_status?.find(s => s.name === 'In Progress')?.count || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{width: `${((dashboardData?.tickets_by_status?.find(s => s.name === 'In Progress')?.count || 0) / (dashboardData?.total_tickets || 1)) * 100}%`}}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-700">Selesai</span>
                <span className="bg-purple-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                  {dashboardData?.tickets_by_status?.find(s => s.name === 'Resolved')?.count || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{width: `${((dashboardData?.tickets_by_status?.find(s => s.name === 'Resolved')?.count || 0) / (dashboardData?.total_tickets || 1)) * 100}%`}}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-700">Ditutup</span>
                <span className="bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                  {dashboardData?.closed_tickets || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{width: `${((dashboardData?.closed_tickets || 0) / (dashboardData?.total_tickets || 1)) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 border-t border-gray-200">
        </div>
      </div>
    </div>
  )

  const renderCustomerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Tiket Saya" 
          value={dashboardData?.my_tickets || 0} 
          icon={TicketIcon} 
        />
        <StatCard 
          title="Tiket Terbuka" 
          value={dashboardData?.my_open_tickets || 0} 
          icon={ClockIcon} 
          color="yellow" 
        />
        <StatCard 
          title="Tiket Ditutup" 
          value={dashboardData?.my_closed_tickets || 0} 
          icon={CheckCircleIcon} 
          color="green" 
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tiket Terbaru Saya</h3>
        <div className="space-y-3">
          {dashboardData?.my_recent_tickets?.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">{ticket.title}</p>
                <p className="text-sm text-gray-600">{ticket.ticket_number}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  ticket.status?.name === 'Open' ? 'bg-blue-100 text-blue-800' :
                  ticket.status?.name === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  ticket.status?.name === 'Resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status?.name}
                </span>
              </div>
            </div>
          )) || (
            <p className="text-gray-500 text-center py-4">Tidak ada tiket terbaru</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderStaffDashboard = () => (
    <div className="space-y-6">
      {(user?.role?.name === 'staff' || user?.role?.name === 'teknisi' || user?.role?.name === 'staff_support') && <SlaAlerts />}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Tiket Saya" 
          value={dashboardData?.my_tickets || 0} 
          icon={TicketIcon} 
        />
        <StatCard 
          title="Terbuka" 
          value={dashboardData?.my_open_tickets || 0} 
          icon={ClockIcon} 
          color="yellow" 
        />
        <StatCard 
          title="Ditutup" 
          value={dashboardData?.my_closed_tickets || 0} 
          icon={CheckCircleIcon} 
          color="green" 
        />
        <StatCard 
          title="Tersedia" 
          value={dashboardData?.available_tickets || 0} 
          icon={TicketIcon} 
          color="purple" 
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tiket Terbaru Saya</h3>
        <div className="space-y-3">
          {dashboardData?.my_recent_tickets?.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">{ticket.title}</p>
                <p className="text-sm text-gray-600">by {ticket.requester?.name}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                ticket.priority?.name === 'Critical' ? 'bg-red-100 text-red-800' :
                ticket.priority?.name === 'High' ? 'bg-orange-100 text-orange-800' :
                ticket.priority?.name === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {ticket.priority?.name}
              </span>
            </div>
          )) || (
            <p className="text-gray-500 text-center py-4">Tidak ada tiket terbaru</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className={user?.role?.name === 'admin' ? '' : 'space-y-6'}>
      {user?.role?.name !== 'admin' && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Selamat datang kembali, {user?.name}!</p>
        </div>
      )}

      {user?.role?.name === 'admin' ? 
        renderAdminDashboard() :
        user?.role?.name === 'pengadu' ? 
        renderCustomerDashboard() :
        renderStaffDashboard()
      }
    </div>
  )
}

export default Dashboard