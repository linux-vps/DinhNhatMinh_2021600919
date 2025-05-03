import React, { useState } from 'react';
import { Modal, Button } from "@/components/reactdash-ui";

export default function DeleteDepartmentModal({ isOpen, onClose, onSubmit, department }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            await onSubmit(department.id);
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
            title="Xóa phòng ban"
        >
            <div className="space-y-4">
                <p className="text-gray-600">
                    Bạn có chắc chắn muốn xóa phòng ban <span className="font-semibold">{department?.name}</span>?
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
                    <Button
                        color="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        color="danger"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 