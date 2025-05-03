import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BoxArrowInRight, Facebook, Twitter } from 'react-bootstrap-icons';
import { Button, Heading, Checkbox, InputLabel, InputPassword, Input } from '@/components/reactdash-ui';
import APIService from '@/services/APIService';

export default function Login() {
  const navigate = useNavigate();
  const logins = {
    login: "Login", link_login: "/auth/login", forgot_link: "/auth/forgot", register: "Register", register_link: "/auth/register", 
    remember: "Remember me", or: "Or", dont: "Dont have an account?", login_fb: "Login with FB", login_twitter: "Login with Twitter"
  }

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await APIService.login(formData);
      if (response.token) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào hệ thống
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <Input
                type="password"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              color="primary"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </div>
        </form>

        <div className="mt-4">
          <p className="text-center mb-3"><span>{logins.or}</span></p>
          <div className="text-center mb-6 sm:space-x-4">
            <a className="p-2 block sm:inline-block rounded lg:rounded-full leading-5 text-gray-100 bg-indigo-900 border border-indigo-900 hover:text-white hover:opacity-90 hover:ring-0 hover:border-indigo-900 focus:bg-indigo-900 focus:border-indigo-800 focus:outline-none focus:ring-0 mb-3" href="#">
              <Facebook className="inline-block w-4 h-4 mx-1" />
              <span className="inline-block lg:hidden">{logins.login_fb}</span>
            </a>
            <a className="p-2 block sm:inline-block rounded lg:rounded-full leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0 mb-3" href="#">
              <Twitter className="inline-block w-4 h-4 mx-1" />
              <span className="inline-block lg:hidden">{logins.login_twitter}</span>
            </a>
          </div>
          <p className="text-center mb-4">{logins.dont} <Link to={logins.register_link} className="hover:text-indigo-500">{logins.register}</Link></p>
        </div>
      </div>
    </div>
  );
}