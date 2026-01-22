import React, { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import api from '../services/authService'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function RealTimeChart({ type = 'line', title, refreshInterval = 18000000 }) {
  const [chartData, setChartData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      const response = await api.get('/dashboard/analytics?hours=24')
      const data = response.data
      
      let newData
      
      if (type === 'doughnut') {
        const statusData = data.status_distribution || []
        newData = {
          labels: statusData.map(s => s.name),
          datasets: [{
            data: statusData.map(s => s.count),
            backgroundColor: [
              '#EF4444',
              '#F59E0B',
              '#10B981',
              '#6B7280'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        }
      } else {
        const ticketsPerHour = data.tickets_per_hour || []
        newData = {
          labels: ticketsPerHour.map(t => new Date(t.hour).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })),
          datasets: [{
            label: title,
            data: ticketsPerHour.map(t => t.count),
            borderColor: '#3B82F6',
            backgroundColor: '#3B82F620',
            tension: 0.4,
            fill: true,
          }]
        }
      }
      
      setChartData(newData)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval, type, title])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: type !== 'doughnut' ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
    animation: {
      duration: 1000,
    }
  }

  if (isLoading || !chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const ChartComponent = type === 'line' ? Line : type === 'bar' ? Bar : Doughnut

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>
      <ChartComponent data={chartData} options={options} />
    </div>
  )
}

export default RealTimeChart