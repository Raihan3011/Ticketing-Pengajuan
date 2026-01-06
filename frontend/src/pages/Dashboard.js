import React, { useState, useEffect } from 'react';
import { ticketAPI } from '../services/api';
import TicketCard from '../components/TicketCard';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getAll(filters);
      setTickets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket) => {
    console.log('Ticket clicked:', ticket);
    // Navigate to ticket detail page
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>My Tickets</h2>
        <button className="btn-primary">Create New Ticket</button>
      </div>

      <div className="filters">
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="1">Open</option>
          <option value="2">In Progress</option>
          <option value="3">Resolved</option>
          <option value="4">Closed</option>
        </select>

        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">All Priority</option>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
          <option value="4">Critical</option>
        </select>
      </div>

      <div className="tickets-container">
        {loading ? (
          <div className="loading">Loading tickets...</div>
        ) : tickets.length > 0 ? (
          <div className="tickets-grid">
            {tickets.map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                onClick={handleTicketClick}
              />
            ))}
          </div>
        ) : (
          <div className="no-tickets">No tickets found</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;