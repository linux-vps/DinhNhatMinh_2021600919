import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminCompact from './components/layouts/AdminCompact';
import AuthIlustration from './views/AuthIlustration';
import EmployeeList from './pages/admin/EmployeeList';
import DepartmentList from './pages/admin/DepartmentList';
import AttendanceList from './pages/admin/AttendanceList';
import LeaveList from './pages/admin/LeaveList';
import SalaryList from './pages/admin/SalaryList';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/*" element={<AuthIlustration />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminCompact />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/employees" />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="attendance" element={<AttendanceList />} />
          <Route path="leaves" element={<LeaveList />} />
          <Route path="salaries" element={<SalaryList />} />
        </Route>

        {/* Redirect to login if route not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}