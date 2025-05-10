import React, { useState } from 'react';
import Modal from 'react-modal';
import { X } from 'react-bootstrap-icons';
import { Button } from "@/components/reactdash-ui";
import http from '@/service/HTTPService';

// Đảm bảo Modal được thiết lập đúng
Modal.setAppElement('#root');

// Styles cho modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '500px',
        width: '100%',
        padding: '20px'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
    }
};

export default function DeleteEmployeeModal({ isOpen, onClose, employee, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            await http.delete(`/employees/${employee.id}`);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa nhân viên');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Xóa nhân viên"
            ariaHideApp={false}
        >
            <div className="modal-header flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-semibold">Xóa nhân viên</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Đóng"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-4">
                <p className="text-gray-600">
                    Bạn có chắc chắn muốn xóa nhân viên <span className="font-semibold">{`${employee?.firstName || ''} ${employee?.lastName || ''}`}</span>?
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
                        type="button"
                    >
                        Hủy
                    </Button>
                    <Button
                        color="danger"
                        onClick={handleDelete}
                        disabled={loading}
                        type="button"
                    >
                        {loading ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 