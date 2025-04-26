import axios from 'axios';

class APIService {
    static BASE_URL = "/api"

    static getHeader() {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
    }

    static getHeadernotContent() {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}`} : {};
    }

    // Các phương thức API
    //AUTH
    //EMPLOYEE
    static async getRandomEmployee() {
        try {
            const response = await axios.get(`${this.BASE_URL}/r?count=20`, {
                headers: this.getHeader()
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    static async getUserById(userId) {
        const response = await axios.get(`${this.BASE_URL}/admin/user/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async createUser(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/admin/employee/create`, formData, {
                headers: {
                    ...this.getHeadernotContent(),
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(userId,formData) {
        const response = await axios.put(`${this.BASE_URL}/admin/user/update/${userId}`,formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
            
        });
        return response.data
        
    }

    
    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/admin/user/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }
    
    //PRODUCT
}

export default APIService; 