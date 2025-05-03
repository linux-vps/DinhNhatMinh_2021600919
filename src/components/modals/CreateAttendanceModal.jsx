import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';

export default function CreateAttendanceModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        check_in: '',
        check_out: '',
        status: 'present'
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
            await onSubmit(formData);
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
            title="Thêm chấm công mới"
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
                    <Input
                        type="date"
                        label="Ngày"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="time"
                        label="Giờ vào"
                        name="check_in"
                        value={formData.check_in}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="time"
                        label="Giờ ra"
                        name="check_out"
                        value={formData.check_out}
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
                        <option value="present">Đúng giờ</option>
                        <option value="late">Đi muộn</option>
                        <option value="absent">Vắng mặt</option>
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
                        {loading ? 'Đang thêm...' : 'Thêm'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
} 