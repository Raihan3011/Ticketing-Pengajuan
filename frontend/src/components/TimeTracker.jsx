import React, { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import api from '../services/authService'
import toast from 'react-hot-toast'
import { 
  PlayIcon,
  StopIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

function TimeTracker({ ticketId }) {
  const [description, setDescription] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)
  const queryClient = useQueryClient()

  const { data: timeData } = useQuery(
    ['time-tracking', ticketId],
    async () => {
      const response = await api.get(`/staff/tickets/${ticketId}/time-logs`)
      return response.data
    }
  )

  const startTimeMutation = useMutation(
    async (data) => {
      const response = await api.post(`/staff/tickets/${ticketId}/time-start`, data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['time-tracking', ticketId])
        toast.success('Time tracking started')
      }
    }
  )

  const stopTimeMutation = useMutation(
    async () => {
      const response = await api.post('/staff/time-stop')
      return response.data
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['time-tracking', ticketId])
        toast.success(`Time logged: ${Math.round(data.duration_minutes)} minutes`)
        setElapsedTime(0)
      }
    }
  )

  useEffect(() => {
    let interval
    if (timeData?.active_log) {
      interval = setInterval(() => {
        const startTime = new Date(timeData.active_log.started_at)
        const now = new Date()
        const elapsed = Math.floor((now - startTime) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timeData?.active_log])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Time Tracking</h3>
      
      {timeData?.active_log ? (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">Timer Running</p>
              <p className="text-sm text-green-600">{timeData.active_log.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-green-800">
                {formatTime(elapsedTime)}
              </p>
              <button
                onClick={() => stopTimeMutation.mutate()}
                disabled={stopTimeMutation.isLoading}
                className="btn btn-danger btn-sm mt-2"
              >
                <StopIcon className="w-4 h-4 mr-1" />
                Stop
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="What are you working on?"
              className="input flex-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              onClick={() => startTimeMutation.mutate({ description })}
              disabled={startTimeMutation.isLoading}
              className="btn btn-primary"
            >
              <PlayIcon className="w-4 h-4 mr-1" />
              Start
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded">
          <ClockIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Total Time</p>
          <p className="font-semibold">{formatDuration(timeData?.total_minutes || 0)}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Sessions</p>
          <p className="font-semibold">{timeData?.time_logs?.length || 0}</p>
        </div>
      </div>

      {timeData?.time_logs?.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Recent Sessions</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {timeData.time_logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                <div>
                  <p className="font-medium">{log.description || 'Working on ticket'}</p>
                  <p className="text-gray-500">
                    {new Date(log.started_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {log.duration_minutes ? formatDuration(log.duration_minutes) : 'Active'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeTracker