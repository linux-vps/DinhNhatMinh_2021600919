import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// layouts
import AdminCompact from '@/components_admin/layout/AdminCompact';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ProtectedRoute from '@/components/ProtectedRoute';
import Employee from '@/components_admin/Content/Employee/Employee';
// Cấu hình future flags cho React Router
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

export default function App() {
  return (
    <BrowserRouter {...router}>
      <Routes>
        {/* add routes with layouts */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminCompact />
          </ProtectedRoute>
        }>
          <Route index element={<div>Dashboard</div>} />
          <Route path="employees" element={<Employee />} />
          <Route path="departments" element={<div>Departments</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}