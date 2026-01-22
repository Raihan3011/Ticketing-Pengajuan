import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { ticketService } from '../services/ticketService'
import {
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

function StaffSupportTools() {
  const [activeTimer, setActiveTimer] = useState(null)

  const { data: slaAlerts } = useQuery(
    'sla-alerts',
    () => ticketService.getSlaAlerts(),
    { refetchInterval: 30000 }
  )

  const handleStartTimer = async (ticketId) => {
    try {
      await ticketService.startTimeTracking(ticketId, {
        description: 'Working on ticket'
      })
      setActiveTimer(ticketId)
    } catch (error) {
      console.error('Failed to start timer:', error)
    }
  }

  const handleStopTimer = async () => {
    try {
      await ticketService.stopTimeTracking()
      setActiveTimer(null)
    } catch (error) {
      console.error('Failed to stop timer:', error)
    }
  }

  return (
    <div className="space-y-6">
      {slaAlerts?.alerts?.length > 0 && (
        <div className="card border-l-4 border-red-500">
          <div className="flex items-center mb-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-900">SLA Alerts</h3>
          </div>
          <div className="space-y-2">
            {slaAlerts.alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                <div>
                  <p className="text-sm font-medium text-red-900">#{alert.id}</p>
                  <p className="text-xs text-red-600">{alert.time_remaining}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  alert.alert_type === 'response_breached' ? 'bg-red-100 text-red-800' :
                  alert.alert_type === 'resolution_breached' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {alert.alert_type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Support Tools</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <button 
            onClick={activeTimer ? handleStopTimer : () => handleStartTimer(null)}
            className={`p-4 rounded-lg text-left transition-colors ${
              activeTimer 
                ? 'bg-red-50 hover:bg-red-100 border border-red-200' 
                : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <ClockIcon className={`w-6 h-6 mb-2 ${activeTimer ? 'text-red-600' : 'text-blue-600'}`} />
            <div className={`text-sm font-medium ${activeTimer ? 'text-red-900' : 'text-blue-900'}`}>
              {activeTimer ? 'Stop Timer' : 'Start Timer'}
            </div>
            <div className={`text-xs ${activeTimer ? 'text-red-600' : 'text-blue-600'}`}>
              {activeTimer ? 'Timer running...' : 'Track work time'}
            </div>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors border border-orange-200">
            <ArrowUpIcon className="w-6 h-6 text-orange-600 mb-2" />
            <div className="text-sm font-medium text-orange-900">Escalate</div>
            <div className="text-xs text-orange-600">Send to supervisor</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors border border-purple-200">
            <WrenchScrewdriverIcon className="w-6 h-6 text-purple-600 mb-2" />
            <div className="text-sm font-medium text-purple-900">Tech Notes</div>
            <div className="text-xs text-purple-600">Add technical details</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors border border-green-200">
            <CheckCircleIcon className="w-6 h-6 text-green-600 mb-2" />
            <div className="text-sm font-medium text-green-900">Mark Resolved</div>
            <div className="text-xs text-green-600">Close ticket</div>
          </button>
          <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-left transition-colors border border-indigo-200">
            <DocumentTextIcon className="w-6 h-6 text-indigo-600 mb-2" />
            <div className="text-sm font-medium text-indigo-900">Knowledge Base</div>
            <div className="text-xs text-indigo-600">Search solutions</div>
          </button>
          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors border border-gray-200">
            <DocumentTextIcon className="w-6 h-6 text-gray-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Bulk Update</div>
            <div className="text-xs text-gray-600">Update multiple</div>
          </button>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">Tickets Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">6.5h</div>
            <div className="text-sm text-gray-600">Time Logged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Escalations</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffSupportTools