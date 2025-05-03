import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';

export default function EditLeaveModal({ isOpen, onClose, onSubmit, leave }) {
    const [formData, setFormData] = useState({
        employee_id: '',
        type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
        status: 'pending'
    });
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await APIService.getEmployees();
                setEmployees(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (leave) {
            setFormData({
                employee_id: leave.employee?.id || '',
                type: leave.type,
                start_date: new Date(leave.start_date).toISOString().split('T')[0],
                end_date: new Date(leave.end_date).toISOString().split('T')[0],
                reason: leave.reason,
                status: leave.status
            });
        }
    }, [leave]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit(leave.id, formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Chỉnh sửa thông tin nghỉ phép"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Select
                        label="Nhân viên"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn nhân viên</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </Select>

                    <Select
                        label="Loại nghỉ"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="annual">Nghỉ phép năm</option>
                        <option value="sick">Nghỉ ốm</option>
                        <option value="unpaid">Nghỉ không lương</option>
                        <option value="other">Khác</option>
                    </Select>

                    <Input
                        type="date"
                        label="Ngày bắt đầu"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="date"
                        label="Ngày kết thúc"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                    />

                    <Textarea
                        label="Lý do"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                    />

                    <Select
                        label="Trạng thái"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
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