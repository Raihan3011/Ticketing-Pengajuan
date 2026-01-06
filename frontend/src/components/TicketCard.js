import React from 'react';

const TicketCard = ({ ticket, onClick }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#28a745',
      'Medium': '#ffc107', 
      'High': '#fd7e14',
      'Critical': '#dc3545'
    };
    return colors[priority] || '#6c757d';
  };

  return (
    <div className="ticket-card" onClick={() => onClick(ticket)}>
      <div className="ticket-header">
        <h3>{ticket.title}</h3>
        <span className="ticket-number">{ticket.ticket_number}</span>
      </div>
      
      <div className="ticket-meta">
        <div className="meta-item">
          <span className="label">Status:</span>
          <span className="status">{ticket.status?.name}</span>
        </div>
        
        <div className="meta-item">
          <span className="label">Priority:</span>
          <span 
            className="priority"
            style={{ color: getPriorityColor(ticket.priority?.name) }}
          >
            {ticket.priority?.name}
          </span>
        </div>
        
        <div className="meta-item">
          <span className="label">Category:</span>
          <span>{ticket.category?.name}</span>
        </div>
        
        <div className="meta-item">
          <span className="label">Requester:</span>
          <span>{ticket.requester?.name}</span>
        </div>
      </div>
      
      <div className="ticket-description">
        {ticket.description.substring(0, 100)}...
      </div>
    </div>
  );
};

export default TicketCard;