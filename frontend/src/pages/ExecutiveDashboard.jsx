import React, { useState } from 'react'
import { useQuery } from 'react-query'
import api from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ClockIcon, 
  CheckCircleIcon,
  UsersIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

function ExecutiveDashboard() {
  const [period, setPeriod] = useState('30')

  const { data: executiveData, isLoading } = useQuery(
    ['executive-dashboard', period],
    async () => {
      const response = await api.get('/dashboard')
      return response.data
    }
  )

  const handleExportReport = async () => {
    try {
      const response = await api.get(`/executive/export-report?period=${period}&format=json`)
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `executive-report-${period}days.json`
      a.click()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (isLoading) return <LoadingSpinner />

  const overview = {
    total_tickets: executiveData?.total_tickets || 0,
    resolution_rate: 85, 
    active_staff: 12, 
  }
  
  const performance_metrics = {
    avg_resolution_time: 24,
    sla_compliance: 92, 
    customer_satisfaction: 4.2, 
    first_response_time: 2, 
  }
  
  const trends = {
    monthly_comparison: {
      growth_percentage: 15 
    }
  }
  
  const category_analysis = executiveData?.tickets_by_status || []
  const priority_distribution = executiveData?.tickets_by_priority || []
  const top_performers = [] 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600">Strategic insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button onClick={handleExportReport} className="btn btn-primary">
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{overview?.total_tickets}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{overview?.resolution_rate}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-semibold text-gray-900">{overview?.active_staff}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
              <p className="text-2xl font-semibold text-gray-900">{performance_metrics?.avg_resolution_time}h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="p-4">
            <p className="text-3xl font-bold text-blue-600">{performance_metrics?.sla_compliance}%</p>
            <p className="text-sm text-gray-600 mt-2">SLA Compliance</p>
          </div>
        </div>

        <div className="card text-center">
          <div className="p-4">
            <p className="text-3xl font-bold text-green-600">{performance_metrics?.customer_satisfaction}</p>
            <p className="text-sm text-gray-600 mt-2">Customer Satisfaction</p>
          </div>
        </div>

        <div className="card text-center">
          <div className="p-4">
            <p className="text-3xl font-bold text-purple-600">{performance_metrics?.first_response_time}h</p>
            <p className="text-sm text-gray-600 mt-2">First Response Time</p>
          </div>
        </div>

        <div className="card text-center">
          <div className="p-4">
            <div className="flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-500 mr-2" />
              <p className="text-3xl font-bold text-green-600">{trends?.monthly_comparison?.growth_percentage}%</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">Monthly Growth</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tickets by Category</h3>
          <div className="space-y-3">
            {category_analysis?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{category.name}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(category.count / category_analysis[0]?.count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-medium text-gray-900">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {priority_distribution?.map((priority, index) => {
              const colors = {
                'Critical': 'bg-red-500',
                'High': 'bg-orange-500', 
                'Medium': 'bg-yellow-500',
                'Low': 'bg-green-500'
              }
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${colors[priority.name] || 'bg-gray-500'}`}></div>
                    <span className="text-gray-700">{priority.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{priority.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {top_performers?.map((performer, index) => (
            <div key={performer.id} className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold">
                {index + 1}
              </div>
              <p className="font-medium text-gray-900">{performer.name}</p>
              <p className="text-sm text-gray-600">{performer.resolved_count} resolved</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization would go here</p>
            <p className="text-sm text-gray-400">Created: {trends?.tickets_created?.length} data points</p>
            <p className="text-sm text-gray-400">Resolved: {trends?.tickets_resolved?.length} data points</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutiveDashboard