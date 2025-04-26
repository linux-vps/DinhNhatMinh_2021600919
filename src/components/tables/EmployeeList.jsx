import React, { useState, useEffect, useCallback } from 'react';
import APIService from '@/services/APIService';
import { Eye, TrashFill, PencilSquare, PlusLg } from 'react-bootstrap-icons';
import { Pagination, Button, Checkbox } from "@/components/reactdash-ui";
import CreateEmployeeModal from '@/components/modals/CreateEmployeeModal';
import EditEmployeeModal from '@/components/modals/EditEmployeeModal';
import DeleteEmployeeModal from '@/components/modals/DeleteEmployeeModal';
import EmployeeDetail from './EmployeeDetail';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const data_per_page = 8;

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await APIService.getRandomEmployee();
            console.log("API Response:", response);
            
            if (response && response.data) {
                // Kiểm tra xem response.data có phải là mảng không
                const employeeData = Array.isArray(response.data) ? response.data : [response.data];
                console.log("Employee data:", employeeData);
                setEmployees(employeeData);
            } else {
                console.error("Invalid response format:", response);
                setError('Dữ liệu không hợp lệ');
            }
            setLoading(false);
        } catch (err) {
            console.error("API Error:", err);
            setError('Không thể tải thông tin nhân viên: ' + (err.message || 'Lỗi không xác định'));
            setLoading(false);
        }
    };

    const onPageChanged = useCallback(
        (event, page) => {
            event.preventDefault();
            setCurrentPage(page);
        },
        [setCurrentPage]
    );

    const handleSelectAll = e => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(employees.map((_, index) => index));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = e => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, parseInt(id)]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== parseInt(id)));
        }
    };

    const handleView = async (employee) => {
        try {
            setLoadingDetail(true);
            const response = await APIService.getUserById(employee.id);
            if (response.success) {
                setSelectedEmployee(response.data);
                setIsDetailModalOpen(true);
            } else {
                console.error('Không thể lấy thông tin chi tiết:', response.message);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin chi tiết:', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleEdit = (employee) => {
        console.log('Sửa thông tin nhân viên:', employee);
    };

    const handleDelete = (employee) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            console.log('Xóa nhân viên:', employee);
        }
    };

    const handleCreateSuccess = () => {
        fetchEmployees(); // Refresh danh sách sau khi thêm mới
    };

    if (loading) return <div className="p-4 text-center">Đang tải...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (!employees || employees.length === 0) return <div className="p-4 text-center">Không có dữ liệu</div>;

    console.log("Current employees:", employees);

    const total_data = employees.length;
    const currentData = employees.slice(
        (currentPage - 1) * data_per_page,
        (currentPage - 1) * data_per_page + data_per_page
    );

    return (
        <div>
            <div className="md:flex md:justify-between mb-3">
                <CreateEmployeeModal onSuccess={handleCreateSuccess} />
                <div>
                    <label className="flex flex-wrap flex-row">
                        <select id="bulk_actions" name="bulk_actions" className="inline-block leading-5 relative py-2 ltr:pl-3 ltr:pr-8 rtl:pr-3 rtl:pl-8 mb-3 rounded bg-gray-100 border border-gray-200 overflow-x-auto focus:outline-none focus:border-gray-300 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 select-caret appearance-none">
                            <option>Hành động</option>
                            <option value="activate">Kích hoạt</option>
                            <option value="deactivate">Hủy kích hoạt</option>
                            <option value="block">Chặn</option>
                            <option value="delete">Xóa</option>
                        </select>        
                        <input type="submit" id="bulk_apply" className="ltr:ml-2 rtl:mr-2 py-2 px-4 inline-block text-center mb-3 rounded leading-5 border hover:bg-gray-300 dark:bg-gray-900 dark:bg-opacity-40 dark:border-gray-800 dark:hover:bg-gray-900 focus:outline-none focus:ring-0 cursor-pointer" value="Áp dụng" />
                    </label>
                </div>
            </div>

            <table className="table-sorter table-bordered-bottom w-full text-gray-500 dark:text-gray-400 dataTable-table">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-900 dark:bg-opacity-40">
                        <th>
                            <Checkbox 
                                name="selectAll"
                                id="selectAll"
                                onChange={handleSelectAll}
                                checked={isCheckAll}
                            />
                        </th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th className="hidden lg:table-cell">Ngày sinh</th>
                        <th>Trạng thái</th>
                        <th className="hidden lg:table-cell">Số điện thoại</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {currentData.map((employee, index) => {
                        const bg_color = "text-green-700 bg-green-100";
                        return (
                            <tr key={index}>
                                <td>
                                    <Checkbox
                                        name={employee.name}
                                        id={index.toString()}
                                        onChange={handleClick}
                                        checked={isCheck.includes(index)}
                                    />
                                </td>
                                <td>
                                    <div className="flex flex-wrap flex-row items-center">
                                        <div className="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">  
                                            {employee.name}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="leading-5">{employee.email}</div>
                                </td>
                                <td className="hidden lg:table-cell">
                                    <div className="leading-5">{employee.date_of_birth}</div>
                                </td>
                                <td>
                                    <div className={`text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full ${bg_color}`}>Hoạt động</div>
                                </td>
                                <td className="hidden lg:table-cell">
                                    <div className="leading-5">{employee.phone}</div>
                                </td>
                                <td className="text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <EmployeeDetail 
                                            employee={employee}
                                            trigger={
                                                <Button 
                                                    color="success" 
                                                    size="small" 
                                                    className="w-8 h-8 !p-0 flex items-center justify-center"
                                                >
                                                    <Eye className="w-4 h-4 text-white" />
                                                </Button>
                                            }
                                        />
                                        <EditEmployeeModal 
                                            employee={employee}
                                            onSuccess={handleCreateSuccess}
                                            trigger={
                                                <Button color="warning" size="small" className="w-8 h-8 !p-0 flex items-center justify-center">
                                                    <PencilSquare className="w-4 h-4 text-white" />
                                                </Button>
                                            }
                                        />
                                        <DeleteEmployeeModal 
                                            employee={employee}
                                            onSuccess={handleCreateSuccess}
                                            trigger={
                                                <Button 
                                                    color="danger" 
                                                    size="small" 
                                                    className="w-8 h-8 !p-0 flex items-center justify-center"
                                                >
                                                    <TrashFill className="w-4 h-4 text-white" />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Pagination
                totalData={total_data}
                perPage={data_per_page}
                className="mt-8"
                onPageChanged={onPageChanged}
                currentPage={currentPage} 
            />


        </div>
    );
};

export default EmployeeList; 