import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminCompact from './components/layouts/AdminCompact';
import EmployeeList from './pages/admin/EmployeeList';
import AuthIlustration from './views/AuthIlustration';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminCompact />}>
          <Route path="employees" element={<EmployeeList />} />

          {/* Thêm các routes khác ở đây khi cần */}
        </Route>
      </Routes>
      <Routes>
      <Route path="/auth/*" element={<AuthIlustration />} />
      </Routes>
    </Router>
  )
}