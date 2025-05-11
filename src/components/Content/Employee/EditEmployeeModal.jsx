import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X } from 'react-bootstrap-icons';
import { Button, Input, Select } from "@/components/reactdash-ui";
import http from '@/service/HTTPService';

// Styles cho modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '600px',
        width: '100%',
        padding: '20px',
        maxHeight: '90vh',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
    }
};

export default function EditEmployeeModal({ isOpen, onClose, employee, onSuccess }) {
    // Add a console log to track when component renders
    // console.log("EditEmployeeModal rendering, isOpen:", isOpen, "employee:", employee?.id);
    
    const initialFormData = {
        firstName: '',
        lastName: '',
        email: '',
        departmentId: '',
        isActive: true,
        phone: '',
        gender: '',
        address: '',
        dateOfBirth: '',
        salary: '',
        hireDate: ''
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset form và lỗi khi đóng modal và cập nhật lỗi ban đầu khi thay đổi
    useEffect(() => {
        if (!isOpen) {
            setError('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const fetchDepartments = async () => {
                try {
                    const response = await http.get('/departments');
                    setDepartments(response.data.data || []);
                } catch (err) {
                    console.error('Lỗi khi lấy danh sách phòng ban:', err);
                    setError('Không thể lấy danh sách phòng ban. Vui lòng thử lại sau.');
                }
            };
            fetchDepartments();
        }
    }, [isOpen]);

    useEffect(() => {
        if (employee) {
            setFormData({
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                email: employee.email || '',
                departmentId: employee.departmentId || '',
                isActive: employee.isActive === true || employee.isActive === 'true',
                phone: employee.phone || '',
                gender: employee.gender || '',
                address: employee.address || '',
                dateOfBirth: employee.dateOfBirth || '',
                salary: employee.salary || '',
                hireDate: employee.hireDate || ''
            });
        } else {
            setFormData(initialFormData);
        }
    }, [employee]);

    // Add effect to log when isOpen changes
    // console.log("EditEmployeeModal isOpen changed to:", isOpen);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isActive' ? value === 'true' : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!employee || !employee.id) {
                throw new Error('Không tìm thấy thông tin nhân viên');
            }

            if (!formData.firstName || !formData.lastName || !formData.email || !formData.departmentId) {
                throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
            }

            const response = await http.put(`/employees/${employee.id}`, formData);
            
            if (response.data) {
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Chỉnh sửa nhân viên"
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={true}
            ariaHideApp={false}
        >
            <div className="modal-header flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-semibold">Chỉnh sửa thông tin nhân viên</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Đóng"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input
                        label="Họ"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Tên"
                        name="lastName"
                        value={formData.lastName}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="tel"
                            label="Số điện thoại"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <Select
                            label="Giới tính"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="date"
                            label="Ngày sinh"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                        <Input
                            type="date"
                            label="Ngày vào làm"
                            name="hireDate"
                            value={formData.hireDate}
                            onChange={handleChange}
                        />
                    </div>
                    <Input
                        type="text"
                        label="Địa chỉ"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <Input
                        type="number"
                        label="Lương (VNĐ)"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="VD: 10000000"
                    />
                    <Select
                        label="Phòng ban"
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn phòng ban</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label="Trạng thái"
                        name="isActive"
                        value={String(formData.isActive)}
                        onChange={handleChange}
                        required
                    >
                        <option value="true">Đang làm việc</option>
                        <option value="false">Đã nghỉ việc</option>
                    </Select>
                </div>

                {error && (
                    <div className="mt-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        color="secondary"
                        onClick={onClose}
                        type="button"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
} 