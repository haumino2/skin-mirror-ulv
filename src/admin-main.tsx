import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AdminDashboard from './components/AdminDashboard'

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <AdminDashboard />
  </React.StrictMode>,
)
