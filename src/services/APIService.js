import axios from 'axios';

class APIService {
    static BASE_URL = "http://localhost:3005/api"

    static getHeader() {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
    }

    static getHeadernotContent() {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}`} : {};
    }

    // Authentication
    static async login(credentials) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/login`, credentials);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async register(userData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    static async getCurrentUser() {
        try {
            const response = await axios.get(`${this.BASE_URL}/auth/me`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Employee Management
    static async getEmployees(page = 1, limit = 10) {
        try {
            const response = await axios.get(`${this.BASE_URL}/employees`, {
                headers: this.getHeader(),
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getEmployeeById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/employee/${id}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createEmployee(employeeData) {
        try {
            // Kiểm tra xem dữ liệu đã là FormData chưa
            const formData = employeeData instanceof FormData 
                ? employeeData 
                : this.convertToFormData(employeeData);

            const response = await axios.post(`${this.BASE_URL}/employee`, formData, {
                headers: {
                    ...this.getHeadernotContent(),
                    // Không đặt Content-Type khi gửi FormData, browser sẽ tự set
                }
            });
            return response.data;
        } catch (error) {
            console.error("API Error - createEmployee:", error);
            throw error;
        }
    }

    static async updateEmployee(id, employeeData) {
        try {
            // Kiểm tra xem dữ liệu đã là FormData chưa
            const formData = employeeData instanceof FormData 
                ? employeeData 
                : this.convertToFormData(employeeData);

            const response = await axios.put(`${this.BASE_URL}/employee/${id}`, formData, {
                headers: {
                    ...this.getHeadernotContent(),
                    // Không đặt Content-Type khi gửi FormData, browser sẽ tự set
                }
            });
            return response.data;
        } catch (error) {
            console.error("API Error - updateEmployee:", error);
            throw error;
        }
    }

    // Helper để chuyển đổi object thành FormData
    static convertToFormData(dataObj) {
        const formData = new FormData();
        
        Object.keys(dataObj).forEach(key => {
            if (dataObj[key] !== null && dataObj[key] !== undefined) {
                if (typeof dataObj[key] === 'boolean') {
                    formData.append(key, dataObj[key].toString());
                } else {
                    formData.append(key, dataObj[key]);
                }
            }
        });
        
        return formData;
    }

    static async deleteEmployee(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/employee/${id}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Department Management
    static async getDepartments() {
        try {
            const response = await axios.get(`${this.BASE_URL}/departments`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Attendance Management
    static async getAttendance(employeeId, startDate, endDate) {
        try {
            const response = await axios.get(`${this.BASE_URL}/attendance`, {
                headers: this.getHeader(),
                params: { employeeId, startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createAttendance(attendanceData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/attendance`, attendanceData, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Leave Management
    static async getLeaves(employeeId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/leaves`, {
                headers: this.getHeader(),
                params: { employeeId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async createLeave(leaveData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/leaves`, leaveData, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Salary Management
    static async getSalary(employeeId, month, year) {
        try {
            const response = await axios.get(`${this.BASE_URL}/salary`, {
                headers: this.getHeader(),
                params: { employeeId, month, year }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default APIService; 