import { http } from './HTTPService';

class DepartmentService {
  static async getDepartments() {
    const response = await http.get('/departments');
    return response.data;
  }
  // Nếu sau này có thêm các hàm CRUD cho phòng ban, chỉ cần bổ sung tại đây
}

export default DepartmentService; 