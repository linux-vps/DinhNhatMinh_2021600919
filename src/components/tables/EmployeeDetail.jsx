import React from 'react';
import { Modal, Button } from "@/components/reactdash-ui";

export default function EmployeeDetail({ employee, trigger }) {
    return (
        <Modal 
            btn_text={trigger}
            btn_color="white"
            title="Chi tiết nhân viên"
        >
            <div className="p-6">
                <div className="flex items-start space-x-6">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <img
                                src={employee?.avatar || 'https://via.placeholder.com/150'}
                                alt={employee?.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {employee?.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {employee?.email}
                        </p>
                        <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Hoạt động
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
                                        Giới tính
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.gender === 'female' ? 'Nữ' : 'Nam'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Ngày sinh
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.date_of_birth}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Số điện thoại
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.phone}
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
                                        Trường đại học
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.university}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Tên đăng nhập
                                    </td>
                                    <td className="py-2 text-sm text-gray-900 dark:text-white">
                                        {employee?.username}
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
                                {employee?.address}, {employee?.ward}, {employee?.district}, {employee?.province}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
} 