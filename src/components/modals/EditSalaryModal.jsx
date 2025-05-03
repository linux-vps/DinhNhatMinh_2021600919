import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';

export default function EditSalaryModal({ isOpen, onClose, onSubmit, salary }) {
    const [formData, setFormData] = useState({
        employee_id: '',
        month: '',
        basic_salary: 0,
        allowance: 0,
        bonus: 0,
        deduction: 0,
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
        if (salary) {
            setFormData({
                employee_id: salary.employee?.id || '',
                month: new Date(salary.month).toISOString().split('T')[0],
                basic_salary: salary.basic_salary,
                allowance: salary.allowance,
                bonus: salary.bonus,
                deduction: salary.deduction,
                status: salary.status
            });
        }
    }, [salary]);

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
            const total_salary = Number(formData.basic_salary) + Number(formData.allowance) + Number(formData.bonus) - Number(formData.deduction);
            await onSubmit(salary.id, { ...formData, total_salary });
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
            title="Chỉnh sửa thông tin lương"
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
                        label="Tháng"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="number"
                        label="Lương cơ bản"
                        name="basic_salary"
                        value={formData.basic_salary}
                        onChange={handleChange}
                        required
                        min="0"
                    />

                    <Input
                        type="number"
                        label="Phụ cấp"
                        name="allowance"
                        value={formData.allowance}
                        onChange={handleChange}
                        required
                        min="0"
                    />

                    <Input
                        type="number"
                        label="Thưởng"
                        name="bonus"
                        value={formData.bonus}
                        onChange={handleChange}
                        required
                        min="0"
                    />

                    <Input
                        type="number"
                        label="Khấu trừ"
                        name="deduction"
                        value={formData.deduction}
                        onChange={handleChange}
                        required
                        min="0"
                    />

                    <Select
                        label="Trạng thái"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="pending">Chưa thanh toán</option>
                        <option value="paid">Đã thanh toán</option>
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