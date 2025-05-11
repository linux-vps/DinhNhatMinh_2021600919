import { http } from './HTTPService';

class EmployeeService {
  static async getEmployees(page = 1, limit = 10) {
    const response = await http.get('/employees', { params: { page, limit } });
    return response.data;
  }

  static async getEmployeeById(id) {
    const response = await http.get(`/employee/${id}`);
    return response.data;
  }

  static async createEmployee(employeeData) {
    const formData = employeeData instanceof FormData
      ? employeeData
      : this.convertToFormData(employeeData);
    const response = await http.post('/employee', formData, {
      headers: { 'Content-Type': undefined }, // Để browser tự set khi là FormData
    });
    return response.data;
  }

  static async updateEmployee(id, employeeData) {
    const formData = employeeData instanceof FormData
      ? employeeData
      : this.convertToFormData(employeeData);
    const response = await http.put(`/employee/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  }

  static async deleteEmployee(id) {
    const response = await http.delete(`/employee/${id}`);
    return response.data;
  }

  // Helper để chuyển object thành FormData
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
}

export default EmployeeService; 