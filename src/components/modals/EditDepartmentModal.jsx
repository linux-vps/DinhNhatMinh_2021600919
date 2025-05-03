import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';

export default function EditDepartmentModal({ isOpen, onClose, onSubmit, department }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        manager_id: ''
    });
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await APIService.getEmployees();
                setManagers(response.data || []);
            } catch (err) {
                console.error(err);
                setManagers([]);
            }
        };
        fetchManagers();
    }, []);

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name || '',
                description: department.description || '',
                manager_id: department.manager?.id || ''
            });
        }
    }, [department]);

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
            await onSubmit(department.id, formData);
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
            title="Chỉnh sửa thông tin phòng ban"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input
                        label="Tên phòng ban"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Mô tả"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <Select
                        label="Trưởng phòng"
                        name="manager_id"
                        value={formData.manager_id}
                        onChange={handleChange}
                    >
                        <option value="">Chọn trưởng phòng</option>
                        {Array.isArray(managers) && managers.map(manager => (
                            <option key={manager.id} value={manager.id}>
                                {manager.name}
                            </option>
                        ))}
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