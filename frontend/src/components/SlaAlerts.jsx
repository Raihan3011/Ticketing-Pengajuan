import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import api from '../services/authService'
import { 
  ExclamationTriangleIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline'

function SlaAlerts() {
  const { data: alerts } = useQuery(
    'sla-alerts',
    async () => {
      const response = await api.get('/staff/sla-alerts')
      return response.data.alerts
    },
    { refetchInterval: 60000 }
  )

  if (!alerts?.length) return null

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'response_breached':
      case 'resolution_breached':
        return <FireIcon className="w-5 h-5 text-red-500" />
      case 'response_warning':
      case 'resolution_warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-blue-500" />
    }
  }

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case 'response_breached':
      case 'resolution_breached':
        return 'border-red-500 bg-red-50'
      case 'response_warning':
      case 'resolution_warning':
        return 'border-yellow-500 bg-yellow-50'
      default:
        return 'border-blue-500 bg-blue-50'
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">SLA Alerts ({alerts.length})</h3>
      </div>
      
      <div className="space-y-2">
        {alerts.slice(0, 5).map((ticket) => (
          <div
            key={ticket.id}
            className={`p-3 border-l-4 rounded-r ${getAlertColor(ticket.alert_type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getAlertIcon(ticket.alert_type)}
                <div className="ml-3">
                  <Link 
                    to={`/app/tickets/${ticket.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {ticket.ticket_number}
                  </Link>
                  <p className="text-sm text-gray-600">{ticket.title}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {ticket.time_remaining}
                </p>
                <p className="text-xs text-gray-500">
                  {ticket.alert_type.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {alerts.length > 5 && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              +{alerts.length - 5} more alerts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlaAlerts