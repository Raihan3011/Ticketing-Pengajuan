import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../services/authService'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  UserGroupIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

function SupervisorDashboard() {
  const queryClient = useQueryClient()
  const [selectedTickets, setSelectedTickets] = useState([])
  const [bulkAssignUser, setBulkAssignUser] = useState('')

  const { data: teamOverview, isLoading } = useQuery(
    'supervisor-team-overview',
    async () => {
      const response = await api.get('/dashboard')
      return response.data
    }
  )

  const { data: teamPerformance } = useQuery(
    'supervisor-team-performance',
    async () => {
      const response = await api.get('/supervisor/team-performance')
      return response.data
    }
  )

  const { data: users } = useQuery('staff-users', async () => {
    const response = await api.get('/users?role=staff')
    return response.data.data
  })

  const bulkAssignMutation = useMutation(
    async (data) => {
      const response = await api.post('/supervisor/tickets/bulk-assign', data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('supervisor-team-overview')
        setSelectedTickets([])
        setBulkAssignUser('')
        toast.success('Tickets assigned successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign tickets')
      }
    }
  )

  const handleBulkAssign = () => {
    if (selectedTickets.length === 0 || !bulkAssignUser) {
      toast.error('Please select tickets and assignee')
      return
    }

    bulkAssignMutation.mutate({
      ticket_ids: selectedTickets,
      assigned_to: bulkAssignUser
    })
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">Supervisor Dashboard</span>
        </div>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{teamOverview?.total_tickets || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{teamOverview?.open_tickets || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unassigned</p>
              <p className="text-2xl font-semibold text-gray-900">{teamOverview?.unassigned_tickets || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <ArrowPathIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Closed Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{teamOverview?.closed_tickets || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Assignment */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Ticket Assignment</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <select
              value={bulkAssignUser}
              onChange={(e) => setBulkAssignUser(e.target.value)}
              className="input"
            >
              <option value="">Select Staff Member</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role?.display_name})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleBulkAssign}
            disabled={selectedTickets.length === 0 || !bulkAssignUser || bulkAssignMutation.isLoading}
            className="btn btn-primary"
          >
            Assign {selectedTickets.length} Tickets
          </button>
        </div>
      </div>

      {/* Staff Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Workload</h3>
          <div className="space-y-3">
            {teamOverview?.staff_workload?.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{staff.name}</p>
                  <p className="text-sm text-gray-600">{staff.role?.display_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{staff.open_tickets}</p>
                  <p className="text-sm text-gray-600">Open Tickets</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance</h3>
          <div className="space-y-3">
            {teamPerformance?.performance?.slice(0, 5).map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{staff.name}</p>
                  <p className="text-sm text-gray-600">
                    {staff.resolved_tickets}/{staff.total_assigned} resolved
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">{staff.resolution_rate}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets by Assignee */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tickets Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamOverview?.tickets_by_assignee?.map((item, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-2xl font-bold text-blue-600">{item.count}</p>
              <p className="text-sm text-gray-600">Assigned Tickets</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SupervisorDashboard