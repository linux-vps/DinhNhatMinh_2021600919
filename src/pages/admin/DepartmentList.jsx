import React, { useState, useEffect } from 'react';
import { PlusLg, PencilSquare, TrashFill } from 'react-bootstrap-icons';
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

export default function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchDepartments = async (page = 1) => {
        try {
            setLoading(true);
            const response = await APIService.getDepartments(page);
            setDepartments(response.data);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách phòng ban');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments(currentPage);
    }, [currentPage]);

    const handleCreate = async (departmentData) => {
        try {
            setLoading(true);
            await APIService.createDepartment(departmentData);
            await fetchDepartments(currentPage);
            setIsCreateModalOpen(false);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi thêm phòng ban: ' + (err.message || 'Không xác định');
            console.error('Lỗi khi thêm phòng ban:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id, departmentData) => {
        try {
            setLoading(true);
            await APIService.updateDepartment(id, departmentData);
            await fetchDepartments(currentPage);
            setIsEditModalOpen(false);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi cập nhật phòng ban: ' + (err.message || 'Không xác định');
            console.error('Lỗi khi cập nhật phòng ban:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await APIService.deleteDepartment(id);
            await fetchDepartments(currentPage);
            setIsDeleteModalOpen(false);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi xóa phòng ban: ' + (err.message || 'Không xác định');
            console.error('Lỗi khi xóa phòng ban:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý phòng ban</h1>
                <Button
                    color="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <PlusLg className="inline-block w-4 h-4 mr-2" />
                    Thêm phòng ban
                </Button>
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
                            <th>ID</th>
                            <th>Tên phòng ban</th>
                            <th>Mô tả</th>
                            <th>Trưởng phòng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : departments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            departments.map((department) => (
                                <tr key={department.id}>
                                    <td>{department.id}</td>
                                    <td>{department.name}</td>
                                    <td>{department.description}</td>
                                    <td>{department.manager?.name || 'Chưa có'}</td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <Button
                                                color="warning"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedDepartment(department);
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                <PencilSquare className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedDepartment(department);
                                                    setIsDeleteModalOpen(true);
                                                }}
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
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Thêm phòng ban mới"
                >
                    <div className="space-y-4">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            handleCreate(data);
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên phòng ban</label>
                                    <input name="name" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                    <textarea name="description" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" rows="3"></textarea>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Trưởng phòng</label>
                                    <select name="managerId" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <option value="">Chọn trưởng phòng</option>
                                        {/* Danh sách nhân viên có thể thêm vào đây */}
                                    </select>
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
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang thêm...' : 'Thêm phòng ban'}
                                </button>
                            </div>
                        </form>
                    </div>
                </SimpleModal>
            )}

            {isEditModalOpen && selectedDepartment && (
                <SimpleModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Chỉnh sửa phòng ban"
                >
                    <div className="space-y-4">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            handleEdit(selectedDepartment.id, data);
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên phòng ban</label>
                                    <input name="name" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedDepartment.name} required />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                    <textarea name="description" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" defaultValue={selectedDepartment.description}></textarea>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Trưởng phòng</label>
                                    <select name="managerId" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedDepartment.managerId || ""}>
                                        <option value="">Chọn trưởng phòng</option>
                                        {/* Danh sách nhân viên có thể thêm vào đây */}
                                    </select>
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
                                    onClick={() => setIsEditModalOpen(false)}
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

            {isDeleteModalOpen && selectedDepartment && (
                <SimpleModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Xác nhận xóa phòng ban"
                >
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Bạn có chắc chắn muốn xóa phòng ban <span className="font-semibold">{selectedDepartment?.name}</span>?
                        </p>
                        <p className="text-sm text-red-500">
                            Hành động này không thể hoàn tác. Tất cả nhân viên trong phòng ban sẽ bị ảnh hưởng.
                        </p>

                        {error && (
                            <div className="text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end space-x-3">
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={() => handleDelete(selectedDepartment.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                disabled={loading}
                            >
                                {loading ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </SimpleModal>
            )}
        </div>
    );
} 