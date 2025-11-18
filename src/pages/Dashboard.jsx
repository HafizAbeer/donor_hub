import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import UserDashboard from './dashboards/UserDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  // Show SuperAdmin dashboard for superadmin role
  if (user?.role === 'superadmin') {
    return <SuperAdminDashboard />;
  }

  // Show Admin dashboard for admin role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Show User dashboard for user role or default
  return <UserDashboard />;
}

