import React from 'react'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid'

function WorkflowTimeline({ ticket }) {
  const steps = [
    {
      name: 'Tiket Dibuat',
      completed: !!ticket?.created_at,
      timestamp: ticket?.created_at,
      description: `Pengadu: ${ticket?.requester?.name}`
    },
    {
      name: 'Staff Notified',
      completed: !!ticket?.staff_notified_at,
      timestamp: ticket?.staff_notified_at,
      description: `Staff: ${ticket?.assigned_user?.name || 'Belum di-assign'}`
    },
    {
      name: 'In Progress',
      completed: ticket?.status?.name === 'In Progress' || ticket?.pimpinan_notified_at || ticket?.pimpinan_approved_at || ticket?.staff_completed_at,
      timestamp: ticket?.status?.name === 'In Progress' ? ticket?.updated_at : null,
      description: 'Staff mulai mengerjakan'
    },
    {
      name: 'Pimpinan Diberitahu',
      completed: !!ticket?.pimpinan_notified_at,
      timestamp: ticket?.pimpinan_notified_at,
      description: `Pimpinan: ${ticket?.pimpinan?.name || '-'}`
    },
    {
      name: 'Approved by Pimpinan',
      completed: !!ticket?.pimpinan_approved_at,
      timestamp: ticket?.pimpinan_approved_at,
      description: 'Pimpinan meng-approve'
    },
    {
      name: 'Completed',
      completed: !!ticket?.staff_completed_at,
      timestamp: ticket?.staff_completed_at,
      description: 'Staff konfirmasi selesai'
    }
  ]

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Progress Tiket</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <ClockIcon className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.name}
                </p>
                {step.timestamp && (
                  <p className="text-xs text-gray-500">
                    {formatDate(step.timestamp)}
                  </p>
                )}
              </div>
              <p className={`text-xs ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkflowTimeline
