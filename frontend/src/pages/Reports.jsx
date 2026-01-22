import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import RealTimeChart from '../components/RealTimeChart'
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon,
  CalendarIcon,
  UserGroupIcon,
  TicketIcon
} from '@heroicons/react/24/outline'

function Reports() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState('30')
  const [reportType, setReportType] = useState('overview')

  const { data: reportData, isLoading } = useQuery(
    ['reports', dateRange, reportType],
    async () => {
      if (user?.role?.name === 'pimpinan') {
        const response = await api.get(`/executive/dashboard?period=${dateRange}`)
        return response.data
      } else if (user?.role?.name === 'supervisor') {
        const response = await api.get('/supervisor/team-performance')
        return response.data
      } else {
        // Admin reports
        const response = await api.get('/dashboard')
        return response.data
      }
    }
  )

  const handleExportReport = async () => {
    try {
      let response
      if (user?.role?.name === 'pimpinan') {
        response = await api.get(`/executive/export-report?period=${dateRange}&format=json`)
      } else {
        // For admin and supervisor, create a simple export
        response = { data: reportData }
      }
      
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${user?.role?.name}-report-${dateRange}days.json`
      a.click()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">
            {user?.role?.name === 'pimpinan' ? 'Executive Reports' : 
             user?.role?.name === 'supervisor' ? 'Team Performance Reports' : 
             'System Reports'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
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

      {/* Report Type Selector */}
      <div className="card">
        <div className="flex space-x-4">
          <button
            onClick={() => setReportType('overview')}
            className={`px-4 py-2 rounded-md ${
              reportType === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setReportType('performance')}
            className={`px-4 py-2 rounded-md ${
              reportType === 'performance' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setReportType('trends')}
            className={`px-4 py-2 rounded-md ${
              reportType === 'trends' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Trends
          </button>
        </div>
      </div>

      {/* Report Content Based on Type */}
      {reportType === 'overview' && (
        <>
          {/* Executive Reports */}
          {user?.role?.name === 'pimpinan' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <ChartBarIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Tickets</h3>
                <p className="text-3xl font-bold text-blue-600">{reportData?.overview?.total_tickets || 0}</p>
              </div>
              
              <div className="card text-center">
                <UserGroupIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Resolution Rate</h3>
                <p className="text-3xl font-bold text-green-600">{reportData?.overview?.resolution_rate || 0}%</p>
              </div>
              
              <div className="card text-center">
                <CalendarIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Avg Resolution</h3>
                <p className="text-3xl font-bold text-purple-600">{reportData?.performance_metrics?.avg_resolution_time || 0}h</p>
              </div>
              
              <div className="card text-center">
                <TicketIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">SLA Compliance</h3>
                <p className="text-3xl font-bold text-yellow-600">{reportData?.performance_metrics?.sla_compliance || 0}%</p>
              </div>
            </div>
          )}

          {/* Admin Reports */}
          {user?.role?.name === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <TicketIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Tickets</h3>
                <p className="text-3xl font-bold text-blue-600">{reportData?.total_tickets || 0}</p>
              </div>
              
              <div className="card text-center">
                <ChartBarIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Open Tickets</h3>
                <p className="text-3xl font-bold text-green-600">{reportData?.open_tickets || 0}</p>
              </div>
              
              <div className="card text-center">
                <UserGroupIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-purple-600">{reportData?.total_users || 0}</p>
              </div>
              
              <div className="card text-center">
                <CalendarIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Closed Tickets</h3>
                <p className="text-3xl font-bold text-yellow-600">{reportData?.closed_tickets || 0}</p>
              </div>
            </div>
          )}

          {/* Tickets by Status */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tickets by Status</h3>
            <div className="space-y-3">
              {reportData?.tickets_by_status?.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tiket Real-Time (24 Jam Terakhir)</h3>
              <div className="h-64">
                <RealTimeChart 
                  type="line"
                  title="Tiket per Jam"
                  refreshInterval={18000000}
                />
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status Tiket Real-Time</h3>
              <div className="h-64">
                <RealTimeChart 
                  type="doughnut"
                  title="Distribusi Status"
                  refreshInterval={46800000}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {reportType === 'performance' && (
        <>
          {/* Team Performance for Supervisor */}
          {user?.role?.name === 'supervisor' && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Assigned</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData?.performance?.map((staff) => (
                      <tr key={staff.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.total_assigned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.resolved_tickets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            staff.resolution_rate >= 80 ? 'bg-green-100 text-green-800' :
                            staff.resolution_rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {staff.resolution_rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Performance Metrics for Admin/Pimpinan */}
          {(user?.role?.name === 'admin' || user?.role?.name === 'pimpinan') && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center">
                  <CalendarIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Avg Response Time</h3>
                  <p className="text-3xl font-bold text-blue-600">{reportData?.performance_metrics?.avg_response_time || '2.5'}h</p>
                </div>
                
                <div className="card text-center">
                  <ChartBarIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">First Call Resolution</h3>
                  <p className="text-3xl font-bold text-green-600">{reportData?.performance_metrics?.first_call_resolution || '75'}%</p>
                </div>
                
                <div className="card text-center">
                  <UserGroupIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Satisfaction</h3>
                  <p className="text-3xl font-bold text-purple-600">{reportData?.performance_metrics?.customer_satisfaction || '4.2'}/5</p>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance by Category</h3>
                <div className="space-y-4">
                  {[
                    { category: 'Technical Issues', resolved: 85, total: 100 },
                    { category: 'Account Problems', resolved: 92, total: 98 },
                    { category: 'General Inquiries', resolved: 78, total: 89 },
                    { category: 'Bug Reports', resolved: 65, total: 75 }
                  ].map((item) => (
                    <div key={item.category} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                      <span className="text-gray-700 font-medium">{item.category}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{item.resolved}/{item.total}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.resolved / item.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{Math.round((item.resolved / item.total) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Performance Analytics Chart */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics Trend</h3>
            <div className="h-64">
              <RealTimeChart 
                type="line"
                title="Resolution Rate %"
                refreshInterval={18000000}
              />
            </div>
          </div>
        </>
      )}

      {reportType === 'trends' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Volume Trends</h3>
            <div className="h-64">
              <RealTimeChart 
                type="line"
                title="Monthly Ticket Volume"
                refreshInterval={18000000}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Comparison</h3>
              <div className="space-y-3">
                {[
                  { month: 'Current Month', tickets: 245, change: '+12%' },
                  { month: 'Last Month', tickets: 218, change: '+5%' },
                  { month: '2 Months Ago', tickets: 207, change: '-3%' },
                  { month: '3 Months Ago', tickets: 213, change: '+8%' }
                ].map((item) => (
                  <div key={item.month} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">{item.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{item.tickets}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        item.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Hours Analysis</h3>
              <div className="space-y-3">
                {[
                  { time: '9:00 - 11:00 AM', tickets: 45, percentage: '18%' },
                  { time: '1:00 - 3:00 PM', tickets: 38, percentage: '15%' },
                  { time: '3:00 - 5:00 PM', tickets: 52, percentage: '21%' },
                  { time: '7:00 - 9:00 PM', tickets: 28, percentage: '11%' }
                ].map((item) => (
                  <div key={item.time} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">{item.time}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{item.tickets} tickets</span>
                      <span className="font-medium text-blue-600">{item.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resolution Time Trends</h3>
            <div className="h-48">
              <RealTimeChart 
                type="line"
                title="Average Resolution Time (hours)"
                refreshInterval={18000000}
              />
            </div>
          </div>
        </div>
      )}

      {/* Real-Time System Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Dashboard Analitik Real-Time</h3>
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Update otomatis setiap 5 jam</span>
          </div>
        </div>
        <div className="h-64">
          <RealTimeChart 
            type="line"
            title="Skor Performa Sistem Keseluruhan"
            refreshInterval={18000000}
          />
        </div>
      </div>
    </div>
  )
}

export default Reports