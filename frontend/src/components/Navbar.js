import React from 'react';
import { authAPI } from '../services/api';

const Navbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>Ticketing System</h1>
      </div>
      
      <div className="nav-links">
        <span className="user-info">Welcome, {user?.name}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;