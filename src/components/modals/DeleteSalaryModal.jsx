import React, { useState } from 'react';
import { Modal, Button } from "@/components/reactdash-ui";

export default function DeleteSalaryModal({ isOpen, onClose, onSubmit, salary }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            await onSubmit(salary.id);
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
            title="Xóa lương"
        >
            <div className="space-y-4">
                <p className="text-gray-600">
                    Bạn có chắc chắn muốn xóa bảng lương của nhân viên <span className="font-semibold">{salary?.employee?.name}</span> tháng <span className="font-semibold">{new Date(salary?.month).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</span>?
                </p>
                <p className="text-sm text-red-500">
                    Hành động này không thể hoàn tác.
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