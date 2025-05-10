import { http } from './HTTPService';

class AuthService {
  static async login(credentials) {
    try {
      const response = await http.post('/auth/login', credentials);
      const resData = response.data.data || response.data;
      if (resData.token) {
        localStorage.setItem('token', resData.token);
        localStorage.setItem('user', JSON.stringify(resData.user));
      }
      return resData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }

  static async register(userData) {
    try {
      const response = await http.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static async getCurrentUser() {
    try {
      const response = await http.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  }
}

export default AuthService; 