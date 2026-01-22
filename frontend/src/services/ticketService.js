import api from './authService'
import axios from 'axios'

const publicApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const ticketService = {
  async getTickets(params = {}) {
    // Clean empty parameters
    const cleanParams = {}
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key]
      }
    })
    
    console.log('Sending params:', cleanParams)
    const response = await api.get('/tickets', { params: cleanParams })
    console.log('API response:', response.data)
    return response.data
  },

  async getTicket(id) {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  },

  async createTicket(data) {
    const response = await api.post('/tickets', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async updateTicket(id, data) {
    const response = await api.put(`/tickets/${id}`, data)
    return response.data
  },

  async assignTicket(id, userId) {
    const response = await api.post(`/tickets/${id}/assign`, { assigned_to: userId })
    return response.data
  },

  async claimTicket(id) {
    const response = await api.post(`/tickets/${id}/assign`, { assigned_to: 'self' })
    return response.data
  },

  async getComments(id) {
    const response = await api.get(`/tickets/${id}/comments`)
    return response.data
  },

  async addComment(id, data) {
    const response = await api.post(`/tickets/${id}/comments`, data)
    return response.data
  },

  async uploadAttachment(id, file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post(`/tickets/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async getHistory(id) {
    const response = await api.get(`/tickets/${id}/history`)
    return response.data
  },

  async submitReport(id, data) {
    const response = await api.post(`/tickets/${id}/report`, data)
    return response.data
  },

  async approveReport(id) {
    const response = await api.post(`/tickets/${id}/approve`)
    return response.data
  },

  async notifyPimpinan(id) {
    const response = await api.post(`/tickets/${id}/notify-pimpinan`)
    return response.data
  },

  async approvePimpinan(id) {
    const response = await api.post(`/tickets/${id}/approve-pimpinan`)
    return response.data
  },

  async completeByStaff(id, data) {
    const response = await api.post(`/tickets/${id}/complete-staff`, data)
    return response.data
  },

  async getSlaAlerts() {
    const response = await api.get('/staff/sla-alerts')
    return response.data
  },

  async escalateTicket(id, data) {
    const response = await api.post(`/staff/tickets/${id}/escalate`, data)
    return response.data
  },

  async checkTicketStatus(ticketNumber) {
    const response = await publicApi.post('/public/check-ticket', { ticket_number: ticketNumber })
    return response.data
  }
}