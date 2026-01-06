import React, { useState, useEffect } from 'react';
import { ticketAPI, categoryAPI, masterAPI } from '../services/api';

const CreateTicket = ({ onTicketCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [categoriesRes, prioritiesRes] = await Promise.all([
        categoryAPI.getAll(),
        masterAPI.getPriorities()
      ]);
      setCategories(categoriesRes.data);
      setPriorities(prioritiesRes.data);
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ticketAPI.create(formData);
      alert('Ticket created successfully!');
      setFormData({
        title: '',
        description: '',
        category_id: '',
        priority_id: ''
      });
      if (onTicketCreated) onTicketCreated();
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket">
      <h2>Create New Ticket</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority_id"
              value={formData.priority_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Priority</option>
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;