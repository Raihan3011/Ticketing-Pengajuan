import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import CreateTicket from './pages/CreateTicket'
import Users from './pages/Users'
import Reports from './pages/Reports'
import KnowledgeBase from './pages/KnowledgeBase'
import Profile from './pages/Profile'
import Ratings from './pages/Ratings'
import StaffSupportDashboard from './pages/StaffSupportDashboard'
import LoadingSpinner from './components/LoadingSpinner'
import InitialLoader from './components/InitialLoader'

function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles.length > 0 && !roles.includes(user?.role?.name)) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <InitialLoader />
  }

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <LandingPage />
      } />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Register />
      } />
      
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="staff-support" element={
          <ProtectedRoute roles={['staff_support', 'admin']}>
            <StaffSupportDashboard />
          </ProtectedRoute>
        } />
        <Route path="tickets" element={<Tickets />} />
        <Route path="tickets/create" element={<CreateTicket />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="profile" element={<Profile />} />
        <Route path="reports" element={
          <ProtectedRoute roles={['admin', 'supervisor', 'pimpinan']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="ratings" element={
          <ProtectedRoute roles={['admin', 'supervisor', 'pimpinan']}>
            <Ratings />
          </ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute roles={['admin']}>
            <Users />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Redirect authenticated users to app */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Navigate to="/app/dashboard" replace />
        </ProtectedRoute>
      } />
      <Route path="/tickets" element={
        <ProtectedRoute>
          <Navigate to="/app/tickets" replace />
        </ProtectedRoute>
      } />
      <Route path="/tickets/*" element={
        <ProtectedRoute>
          <Navigate to="/app/tickets" replace />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <Navigate to="/app/users" replace />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App