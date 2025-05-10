import React from 'react';
import Modal from 'react-modal';
import { X, PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { Button } from "@/components/reactdash-ui";

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
        maxWidth: '700px',
        width: '100%',
        padding: '20px',
        maxHeight: '90vh',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
    }
};

export default function EmployeeDetail({ isOpen, onClose, employee, onEdit, onDelete }) {
    if (!employee) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Chi tiết nhân viên"
            ariaHideApp={false}
        >
            <div className="modal-header flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-semibold">Chi tiết nhân viên</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Đóng"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="p-6">
                <div className="flex items-start space-x-6">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <img
                                src={employee?.avatar || 'https://via.placeholder.com/150'}
                                alt={`${employee?.firstName} ${employee?.lastName}`}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <span className={`absolute bottom-0 right-0 w-4 h-4 ${employee?.isActive ? 'bg-green-400' : 'bg-red-400'} border-2 border-white rounded-full`}></span>
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {`${employee?.firstName || ''} ${employee?.lastName || ''}`}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {employee?.email}
                        </p>
                        <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                employee?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {employee?.isActive ? 'Đang làm việc' : 'Đã nghỉ việc'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Detailed Info Section */}
                <div className="mt-6 grid grid-cols-2 gap-6">
                    <div className="col-span-2 lg:col-span-1">
                        <table className="min-w-full">
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Mã nhân viên
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.id}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Giới tính
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.gender || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Ngày sinh
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.dateOfBirth || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Số điện thoại
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.phone || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <table className="min-w-full">
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Phòng ban
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.department?.name || '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Lương
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.salary ? `${Number(employee.salary).toLocaleString('vi-VN')} VNĐ` : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Ngày vào làm
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.hireDate || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Address Section */}
                    <div className="col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Địa chỉ
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm text-gray-900 dark:text-white">
                                {employee?.address || '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Button Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        color="secondary"
                        onClick={onClose}
                        type="button"
                    >
                        Đóng
                    </Button>
                    <Button
                        color="warning"
                        onClick={() => {
                            onClose();
                            onEdit?.(employee);
                        }}
                        type="button"
                    >
                        <PencilSquare className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                    </Button>
                    <Button
                        color="danger"
                        onClick={() => {
                            onClose();
                            onDelete?.(employee);
                        }}
                        type="button"
                    >
                        <TrashFill className="w-4 h-4 mr-2" />
                        Xóa
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 