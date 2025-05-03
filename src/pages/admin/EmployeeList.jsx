import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusLg, PencilSquare, TrashFill, Eye } from 'react-bootstrap-icons';
import { Button, Card, Table, Pagination } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';

// SimpleModal component cho việc hiển thị modal
function SimpleModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-screen overflow-auto relative z-10">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Đóng"
                    >
                        X
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchEmployees = async (page = 1) => {
        try {
            setLoading(true);
            const response = await APIService.getEmployees(page);
            setEmployees(response.data);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách nhân viên');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(currentPage);
    }, [currentPage]);

    const handleCreate = async (employeeData) => {
        console.log("Bắt đầu thêm nhân viên", employeeData);
        try {
            setLoading(true);
            const response = await APIService.createEmployee(employeeData);
            console.log("Kết quả từ API:", response);
            await fetchEmployees(currentPage);
            setIsCreateModalOpen(false);
            setError(null);
            return true;
        } catch (err) {
            console.error('Chi tiết lỗi khi thêm nhân viên:', err);
            const errorMessage = err.response?.data?.message || 'Lỗi khi thêm nhân viên: ' + (err.message || 'Không xác định');
            console.error('Lỗi khi thêm nhân viên:', errorMessage);
            setError(errorMessage);
            // Không đóng modal để người dùng có thể sửa lỗi
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id, employeeData) => {
        console.log("Bắt đầu sửa nhân viên ID:", id, employeeData);
        try {
            setLoading(true);
            const response = await APIService.updateEmployee(id, employeeData);
            console.log("Kết quả từ API:", response);
            await fetchEmployees(currentPage);
            setIsEditModalOpen(false);
            setError(null);
            return true;
        } catch (err) {
            console.error('Chi tiết lỗi khi cập nhật nhân viên:', err);
            const errorMessage = err.response?.data?.message || 'Lỗi khi cập nhật nhân viên: ' + (err.message || 'Không xác định');
            console.error('Lỗi khi cập nhật nhân viên:', errorMessage);
            setError(errorMessage);
            // Không đóng modal để người dùng có thể sửa lỗi
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await APIService.deleteEmployee(id);
            await fetchEmployees(currentPage);
            setIsDeleteModalOpen(false);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi xóa nhân viên';
            console.error('Lỗi khi xóa nhân viên:', err);
            setError(errorMessage);
            setIsDeleteModalOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const openCreateModal = () => {
        console.log("Mở modal thêm nhân viên được gọi");
        setIsCreateModalOpen(true);
        console.log("isCreateModalOpen set to:", true);
    };

    const closeCreateModal = () => {
        console.log("Đóng modal thêm nhân viên được gọi");
        setIsCreateModalOpen(false);
        console.log("isCreateModalOpen set to:", false);
    };
    
    const openEditModal = (employee) => {
        if (employee && employee.id) {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
        } else {
            setError('Không thể chỉnh sửa: Không tìm thấy thông tin nhân viên');
        }
    };
    
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setTimeout(() => setSelectedEmployee(null), 300);
    };
    
    const openDeleteModal = (employee) => {
        if (employee && employee.id) {
        setSelectedEmployee(employee);
        setIsDeleteModalOpen(true);
        } else {
            setError('Không thể xóa: Không tìm thấy thông tin nhân viên');
        }
    };
    
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTimeout(() => setSelectedEmployee(null), 300);
    };
    
    const openDetailModal = (employee) => {
        if (employee && employee.id) {
        setSelectedEmployee(employee);
        setIsDetailModalOpen(true);
        } else {
            setError('Không thể xem chi tiết: Không tìm thấy thông tin nhân viên');
        }
    };
    
    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setTimeout(() => setSelectedEmployee(null), 300);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
                <div className="flex space-x-2">
                <Button
                    color="primary"
                    onClick={openCreateModal}
                >
                    <PlusLg className="inline-block w-4 h-4 mr-2" />
                    Thêm nhân viên
                </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Phòng ban</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : employees.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            employees.map((employee, index) => (
                                <tr key={employee.id}>
                                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                                    <td>{`${employee.firstName || ''} ${employee.lastName || ''}`}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.department?.name || '-'}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            employee.status === 'active' || employee.isActive
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {employee.status === 'active' || employee.isActive ? 'Đang làm việc' : 'Đã nghỉ việc'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <Button
                                                color="info"
                                                size="sm"
                                                title="Xem chi tiết"
                                                onClick={() => openDetailModal(employee)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                color="warning"
                                                size="sm"
                                                title="Chỉnh sửa"
                                                onClick={() => openEditModal(employee)}
                                            >
                                                <PencilSquare className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                title="Xóa"
                                                onClick={() => openDeleteModal(employee)}
                                            >
                                                <TrashFill className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modals */}
            {isCreateModalOpen && (
                <SimpleModal 
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                    title="Thêm nhân viên mới"
                >
                    <div className="space-y-4">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            data.isActive = data.isActive === "true";
                            handleCreate(data);
                        }}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ</label>
                                        <input name="firstName" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                                        <input name="lastName" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input name="email" type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                        <input name="password" type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                        <input name="phone" type="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                        <select name="gender" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="">Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                        <input name="dateOfBirth" type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày vào làm</label>
                                        <input name="hireDate" type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <textarea name="address" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" rows="2"></textarea>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Vị trí công việc</label>
                                        <input name="position" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lương (VNĐ)</label>
                                        <input name="salary" type="number" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="VD: 10000000" />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phòng ban</label>
                                        <select name="departmentId" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                            <option value="">Chọn phòng ban</option>
                                            <option value="1">Phòng Kỹ thuật</option>
                                            <option value="2">Phòng Kinh doanh</option>
                                            <option value="3">Phòng Nhân sự</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                        <select name="isActive" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="true">Đang làm việc</option>
                                            <option value="false">Đã nghỉ việc</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                        <select name="role" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="Thành viên">Thành viên</option>
                                            <option value="Quản lý">Quản lý</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số ngày phép/tháng</label>
                                        <input name="leaveDaysPerMonth" type="number" step="0.5" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="5.0" />
                                    </div>
                                </div>
                            </div>
                            
                            {error && (
                                <div className="mt-4 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button 
                                    type="button" 
                                    onClick={closeCreateModal}
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang thêm...' : 'Thêm nhân viên'}
                                </button>
                            </div>
                        </form>
                    </div>
                </SimpleModal>
            )}

            {isEditModalOpen && selectedEmployee && (
                <SimpleModal 
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                    title="Chỉnh sửa thông tin nhân viên"
                >
                    <div className="space-y-4">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            data.isActive = data.isActive === "true";
                            handleEdit(selectedEmployee.id, data);
                        }}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ</label>
                                        <input name="firstName" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.firstName} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                                        <input name="lastName" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.lastName} required />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input name="email" type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.email} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                        <input name="phone" type="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.phone} />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                        <select name="gender" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.gender}>
                                            <option value="">Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                        <select name="role" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.role || "Thành viên"}>
                                            <option value="Thành viên">Thành viên</option>
                                            <option value="Quản lý">Quản lý</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                        <input name="dateOfBirth" type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.dateOfBirth} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày vào làm</label>
                                        <input name="hireDate" type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.hireDate} />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <textarea name="address" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" rows="2" defaultValue={selectedEmployee.address}></textarea>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Vị trí công việc</label>
                                        <input name="position" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.position} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lương (VNĐ)</label>
                                        <input name="salary" type="number" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.salary} placeholder="VD: 10000000" />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phòng ban</label>
                                        <select name="departmentId" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.departmentId} required>
                                            <option value="">Chọn phòng ban</option>
                                            <option value="1">Phòng Kỹ thuật</option>
                                            <option value="2">Phòng Kinh doanh</option>
                                            <option value="3">Phòng Nhân sự</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                        <select name="isActive" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={String(selectedEmployee.isActive)}>
                                            <option value="true">Đang làm việc</option>
                                            <option value="false">Đã nghỉ việc</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số ngày phép/tháng</label>
                                        <input name="leaveDaysPerMonth" type="number" step="0.5" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.leaveDaysPerMonth || "5.0"} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số ngày phép còn lại</label>
                                        <input name="remainingLeaveDays" type="number" step="0.5" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEmployee.remainingLeaveDays || selectedEmployee.leaveDaysPerMonth || "5.0"} />
                                    </div>
                                </div>
                            </div>
                            
                            {error && (
                                <div className="mt-4 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button 
                                    type="button" 
                                    onClick={closeEditModal}
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </SimpleModal>
            )}

            {isDeleteModalOpen && selectedEmployee && (
                <SimpleModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                    title="Xác nhận xóa nhân viên"
                >
                    <div className="space-y-4">
                        <p>Bạn có chắc chắn muốn xóa nhân viên {selectedEmployee.firstName} {selectedEmployee.lastName}?</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button 
                                onClick={closeDeleteModal}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={() => handleDelete(selectedEmployee.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </SimpleModal>
            )}

            {isDetailModalOpen && selectedEmployee && (
                <SimpleModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                    title="Chi tiết nhân viên"
                >
                    <div className="space-y-6">
                        <div className="flex items-start space-x-6">
                            {/* Avatar Section */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img
                                        src={selectedEmployee?.avatar ? `/uploads/${selectedEmployee.avatar}` : 'https://via.placeholder.com/150'}
                                        alt={`${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <span className={`absolute bottom-0 right-0 w-4 h-4 ${selectedEmployee?.isActive ? 'bg-green-400' : 'bg-red-400'} border-2 border-white rounded-full`}></span>
                                </div>
                            </div>

                            {/* Basic Info Section */}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {`${selectedEmployee?.firstName || ''} ${selectedEmployee?.lastName || ''}`.trim() || selectedEmployee?.email}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedEmployee?.email}
                                </p>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        selectedEmployee?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedEmployee?.isActive ? 'Đang làm việc' : 'Đã nghỉ việc'}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-sm font-medium text-gray-500">Vai trò: </span>
                                    <span className="text-sm text-gray-900">{selectedEmployee?.role || 'Thành viên'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Info Section */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <table className="min-w-full">
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr>
                                            <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Mã nhân viên
                                            </td>
                                            <td className="py-2 text-sm text-gray-900 dark:text-white">
                                                {selectedEmployee?.id}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Giới tính
                                            </td>
                                            <td className="py-2 text-sm text-gray-900 dark:text-white">
                                                {selectedEmployee?.gender || '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Ngày sinh
                                            </td>
                                            <td className="py-2 text-sm text-gray-900 dark:text-white">
                                                {selectedEmployee?.dateOfBirth || '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Số điện thoại
                                            </td>
                                            <td className="py-2 text-sm text-gray-900 dark:text-white">
                                                {selectedEmployee?.phone || '-'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="col-span-1">
                                <table className="min-w-full">
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr>
                                            <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Phòng ban
                                            </td>
                                            <td className="py-2 text-sm text-gray-900 dark:text-white">
                                                {selectedEmployee?.department?.name || '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Vị trí
                                            </td>
                                            <td className="py-2 text-sm text-gray-900 dark:text-white">
                                                {selectedEmployee?.position || '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Lương
                                            </td>
                                            <td className="py-2 text-sm text-gray-900 dark:text-white">
                                                {selectedEmployee?.salary ? `${Number(selectedEmployee.salary).toLocaleString('vi-VN')} VNĐ` : '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Ngày vào làm
                                            </td>
                                            <td className="py-2 text-sm text-gray-900 dark:text-white">
                                                {selectedEmployee?.hireDate || '-'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="col-span-2">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Địa chỉ
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {selectedEmployee?.address || '-'}
                                </p>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Số ngày phép/tháng
                                </h4>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {selectedEmployee?.leaveDaysPerMonth || '0'} ngày
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Số ngày phép còn lại
                                </h4>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {selectedEmployee?.remainingLeaveDays || '0'} ngày
                                </p>
                            </div>
                        </div>

                        {/* Button Actions */}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button 
                                onClick={closeDetailModal}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Đóng
                            </button>
                            <button 
                                onClick={() => {
                                    closeDetailModal();
                                    openEditModal(selectedEmployee);
                                }}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                            >
                                Chỉnh sửa
                            </button>
                            <button 
                                onClick={() => {
                                    closeDetailModal();
                                    openDeleteModal(selectedEmployee);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </SimpleModal>
            )}
        </div>
    );
} 