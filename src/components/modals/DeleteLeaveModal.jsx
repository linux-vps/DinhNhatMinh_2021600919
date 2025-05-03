import React, { useState } from 'react';
import { Modal, Button } from "@/components/reactdash-ui";

export default function DeleteLeaveModal({ isOpen, onClose, onSubmit, leave }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            await onSubmit(leave.id);
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
            title="Xóa nghỉ phép"
        >
            <div className="space-y-4">
                <p className="text-gray-600">
                    Bạn có chắc chắn muốn xóa đơn nghỉ phép của nhân viên <span className="font-semibold">{leave?.employee?.name}</span> từ ngày <span className="font-semibold">{new Date(leave?.start_date).toLocaleDateString()}</span> đến <span className="font-semibold">{new Date(leave?.end_date).toLocaleDateString()}</span>?
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