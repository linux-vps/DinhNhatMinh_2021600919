import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '@/components/reactdash-ui';
import APIService from '@/services/APIService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await APIService.register(formData);
      navigate('/auth/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Họ và tên"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            label="Mật khẩu"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            label="Xác nhận mật khẩu"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            color="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <a href="/" className="text-indigo-600 hover:text-indigo-500">
              Đăng nhập
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
} 