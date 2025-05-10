import axios from 'axios';

// Cấu hình môi trường
const ENV = {
  development: {
    baseURL: 'http://localhost:3005/api',
    timeout: 10000,
    useMock: false // Tắt mock API để gửi request đến backend thực tế
  },
  production: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3005/api',
    timeout: 10000,
    useMock: false
  }
};

const currentEnv = import.meta.env.MODE || 'development';
const config = ENV[currentEnv];

// Tạo instance axios
const http = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request trong development mode
    if (currentEnv === 'development') {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response) => {
    // Log response trong development mode
    if (currentEnv === 'development') {
      console.log('✅ Response:', {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Log error trong development mode
    if (currentEnv === 'development') {
      console.error('❌ Network Error:', error);
    }

    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

// Helper functions
const api = {
  get: (url, config = {}) => http.get(url, config),
  post: (url, data, config = {}) => http.post(url, data, config),
  put: (url, data, config = {}) => http.put(url, data, config),
  delete: (url, config = {}) => http.delete(url, config),
  patch: (url, data, config = {}) => http.patch(url, data, config)
};

export { api };
export { http };
export default http; 