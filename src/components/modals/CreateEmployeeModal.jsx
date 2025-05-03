import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X } from 'react-bootstrap-icons';
import { Button, Input, Select } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';

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

export default function CreateEmployeeModal({ isOpen, onClose, onSubmit, initialError = null }) {
    // Add a console log to track when component renders
    console.log("CreateEmployeeModal rendering, isOpen:", isOpen);
    
    const initialFormData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        departmentId: '',
        isActive: true,
        phone: '',
        gender: '',
        address: '',
        dateOfBirth: '',
        salary: '',
        hireDate: new Date().toISOString().split('T')[0]
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset form khi đóng modal và cập nhật lỗi ban đầu khi thay đổi
    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormData);
            setError('');
        } else if (initialError) {
            setError(initialError);
        }
    }, [isOpen, initialError]);

    useEffect(() => {
        if (isOpen) {
            // Chỉ fetch data khi modal mở
            const fetchData = async () => {
                try {
                    const depts = await APIService.getDepartments();
                    setDepartments(depts.data || []);
                } catch (err) {
                    console.error('Lỗi khi lấy danh sách phòng ban:', err);
                    setDepartments([]);
                    setError('Không thể lấy danh sách phòng ban. Vui lòng thử lại sau.');
                }
            };
            fetchData();
        }
    }, [isOpen]);

    // Add effect to log when isOpen changes
    useEffect(() => {
        console.log("CreateEmployeeModal isOpen changed to:", isOpen);
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Xử lý đặc biệt cho isActive vì select trả về string
        if (name === 'isActive') {
            setFormData(prev => ({
                ...prev,
                [name]: value === 'true'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        console.log("Bắt đầu submit form thêm nhân viên");

        try {
            // Kiểm tra các trường bắt buộc
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.departmentId) {
                throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
            }
            
            // Chuyển đổi dữ liệu sang FormData để phù hợp với API
            const formDataObj = new FormData();
            
            // Tạo bản sao để tránh thay đổi state trực tiếp
            const processedData = { ...formData };
            
            // Đảm bảo ngày tháng đúng định dạng nếu có giá trị
            if (processedData.dateOfBirth) {
                try {
                    const date = new Date(processedData.dateOfBirth);
                    processedData.dateOfBirth = date.toISOString().split('T')[0];
                } catch (err) {
                    console.warn('Lỗi định dạng ngày sinh:', err);
                }
            }
            
            if (processedData.hireDate) {
                try {
                    const date = new Date(processedData.hireDate);
                    processedData.hireDate = date.toISOString().split('T')[0];
                } catch (err) {
                    console.warn('Lỗi định dạng ngày vào làm:', err);
                }
            }
            
            // Thêm tất cả các trường vào FormData
            Object.keys(processedData).forEach(key => {
                // Chuyển boolean thành string để tránh lỗi khi gửi FormData
                if (typeof processedData[key] === 'boolean') {
                    formDataObj.append(key, processedData[key].toString());
                } else if (processedData[key] !== null && processedData[key] !== undefined && processedData[key] !== '') {
                    formDataObj.append(key, processedData[key]);
                }
            });
            
            console.log("Gửi dữ liệu lên API");
            
            try {
                const result = await onSubmit(formDataObj);
                console.log("Kết quả từ API:", result);
                
                if (result !== false) {
                    console.log("Đóng modal do thành công");
                    onClose();
                    // Reset form sau khi submit thành công
                    setFormData(initialFormData);
                } else {
                    console.log("Không đóng modal do gặp lỗi");
                }
            } catch (apiErr) {
                console.error("Lỗi khi gọi API:", apiErr);
                throw apiErr;
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thêm nhân viên';
            setError(errorMessage);
            console.error('Lỗi khi thêm nhân viên:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Thêm nhân viên mới"
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={true}
            ariaHideApp={false}
        >
            <div className="modal-header flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-semibold">Thêm nhân viên mới</h3>
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
                    <Input
                        type="password"
                        label="Mật khẩu"
                        name="password"
                        value={formData.password}
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
                        {Array.isArray(departments) && departments.map(dept => (
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
                        {loading ? 'Đang thêm...' : 'Thêm'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
} 