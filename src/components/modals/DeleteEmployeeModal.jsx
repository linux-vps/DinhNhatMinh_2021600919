import React from 'react';
import { Modal, Button } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';

export default function DeleteEmployeeModal({ employee, onSuccess, trigger }) {
    const handleDelete = async () => {
        try {
            const response = await APIService.deleteUser(employee.id);
            if (response.success) {
                alert('Xóa nhân viên thành công!');
                onSuccess && onSuccess();
            } else {
                alert('Có lỗi xảy ra khi xóa nhân viên!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa nhân viên:', error);
            alert('Có lỗi xảy ra khi xóa nhân viên!');
        }
    };

    return (
        <Modal
            btn_text={trigger}
            btn_color="white"
            title="Xác nhận xóa nhân viên"
        >
            <div className="p-6">
                <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        Bạn có chắc chắn muốn xóa nhân viên <span className="font-semibold">{employee?.name}</span>?
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Hành động này không thể hoàn tác.
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button color="secondary" data-modal-close>
                        Hủy
                    </Button>
                    <Button color="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 