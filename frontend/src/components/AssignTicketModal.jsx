import { useState, useEffect } from 'react'
import api from '../services/authService'

export default function AssignTicketModal({ ticket, isOpen, onClose, onAssign }) {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  const fetchUsers = async () => {
    setFetchingUsers(true)
    try {
      console.log('Fetching users for assignment...')
    
      let response
      try {
        response = await api.get('/users?role=staff')
      } catch (error) {
        console.log('Staff endpoint failed, trying general users endpoint')
        response = await api.get('/users')
      }
      
      console.log('Users response:', response.data)
      
      let allUsers = []
      if (response.data.data) {
        allUsers = response.data.data
      } else if (Array.isArray(response.data)) {
        allUsers = response.data
      } else {
        console.error('Unexpected response structure:', response.data)
        allUsers = []
      }
      
      const staffUsers = allUsers.filter(user => 
        user.role && (user.role.name === 'staff' || user.role.name === 'teknisi')
      )
      
      console.log('All users:', allUsers)
      console.log('Filtered staff users:', staffUsers)
      setUsers(staffUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setFetchingUsers(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedUser) return
    
    setLoading(true)
    try {
      await onAssign(selectedUser)
      onClose()
    } catch (error) {
      console.error('Error assigning ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Assign Ticket</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Assign to:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            disabled={fetchingUsers}
          >
            <option value="">
              {fetchingUsers ? 'Loading users...' : 'Select user...'}
            </option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role?.name || 'No role'})
              </option>
            ))}
          </select>
          {users.length === 0 && !fetchingUsers && (
            <p className="text-sm text-gray-500 mt-1">No staff users available</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedUser || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  )
}