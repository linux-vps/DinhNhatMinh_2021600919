import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';

export default function EditEmployeeModal({ employee, onSuccess, trigger }) {
    const [formData, setFormData] = useState({
        name: '',
        gender: 'female',
        date_of_birth: '',
        university: '',
        province: '',
        district: '',
        ward: '',
        address: '',
        phone: '',
        email: '',
        username: ''
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                gender: employee.gender || 'female',
                date_of_birth: employee.date_of_birth || '',
                university: employee.university || '',
                province: employee.province || '',
                district: employee.district || '',
                ward: employee.ward || '',
                address: employee.address || '',
                phone: employee.phone || '',
                email: employee.email || '',
                username: employee.username || ''
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await APIService.updateUser(employee.id, formData);
            if (response) {
                alert('Cập nhật thông tin nhân viên thành công!');
                onSuccess && onSuccess();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin nhân viên!');
        }
    };

    return (
        <Modal btn_text={trigger} btn_color = "white" title="Cập nhật thông tin nhân viên">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                            required
                        >
                            <option value="female">Nữ</option>
                            <option value="male">Nam</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                        <Input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trường đại học</label>
                        <Input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                        <Input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                        <Input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                        <Input
                            type="text"
                            name="ward"
                            value={formData.ward}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                    <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                    <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                    <Button type="submit" color="warning">
                        Cập nhật
                    </Button>
                </div>
            </form>
        </Modal>
    );
} 