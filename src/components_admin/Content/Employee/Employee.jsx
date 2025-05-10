import React, { useState, useEffect } from 'react';
import { Eye, TrashFill, PencilSquare, PlusLg } from 'react-bootstrap-icons';
import { Pagination, Button, Checkbox } from "@/components/reactdash-ui";
import CreateEmployeeModal from '@/components_admin/Content/Employee/CreateEmployeeModal';
import EditEmployeeModal from '@/components_admin/Content/Employee/EditEmployeeModal';
import DeleteEmployeeModal from '@/components_admin/Content/Employee/DeleteEmployeeModal';
import EmployeeDetail from '@/components_admin/Content/Employee/EmployeeDetail';
import http from '@/service/HTTPService';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const data_per_page = 8;

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await http.get('/employees');
            if (response.data) {
                setEmployees(response.data.data || []);
            }
            setError(null);
        } catch (err) {
            console.error("API Error:", err);
            setError('Không thể tải thông tin nhân viên: ' + (err.message || 'Lỗi không xác định'));
        } finally {
            setLoading(false);
        }
    };

    const onPageChanged = (event, page) => {
        event.preventDefault();
        setCurrentPage(page);
    };

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

    const handleOpenCreate = () => {
        setCreateModalOpen(true);
    };

    const handleOpenEdit = (employee) => {
        setSelectedEmployee(employee);
        setEditModalOpen(true);
    };

    const handleOpenDelete = (employee) => {
        setSelectedEmployee(employee);
        setDeleteModalOpen(true);
    };

    const handleOpenDetail = (employee) => {
        setSelectedEmployee(employee);
        setDetailModalOpen(true);
    };

    const handleCloseCreate = () => setCreateModalOpen(false);
    const handleCloseEdit = () => setEditModalOpen(false);
    const handleCloseDelete = () => setDeleteModalOpen(false);
    const handleCloseDetail = () => setDetailModalOpen(false);

    const handleView = async (employee) => {
        try {
            setLoadingDetail(true);
            const response = await http.get(`/employees/${employee.id}`);
            if (response.data) {
                setSelectedEmployee(response.data);
        setIsDetailModalOpen(true);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin chi tiết:', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleCreateSuccess = () => {
        fetchEmployees();
    };

    if (loading) return <div className="p-4 text-center">Đang tải...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (!employees || employees.length === 0) return <div className="p-4 text-center">Không có dữ liệu</div>;

    const total_data = employees.length;
    const currentData = employees.slice(
        (currentPage - 1) * data_per_page,
        (currentPage - 1) * data_per_page + data_per_page
    );

    return (
        <div>
            <div className="md:flex md:justify-between mb-3">
                <Button color="primary" onClick={handleOpenCreate}>
                    <PlusLg className="inline-block w-4 h-4 ltr:mr-2 rtl:ml-2" /> Thêm nhân viên
                </Button>
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
                        const bg_color = employee.isActive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100";
                        return (
                            <tr key={employee.id}>
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
                                            {`${employee.firstName} ${employee.lastName}`}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="leading-5">{employee.email}</div>
                                </td>
                                <td className="hidden lg:table-cell">
                                    <div className="leading-5">{employee.dateOfBirth}</div>
                                    </td>
                                    <td>
                                    <div className={`text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full ${bg_color}`}>
                                        {employee.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                    </div>
                                </td>
                                <td className="hidden lg:table-cell">
                                    <div className="leading-5">{employee.phone}</div>
                                </td>
                                <td className="text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Button
                                            color="success"
                                            size="small"
                                            className="w-8 h-8 !p-0 flex items-center justify-center"
                                            onClick={() => handleOpenDetail(employee)}
                                        >
                                            <Eye className="w-4 h-4 text-white" />
                                        </Button>
                                        <Button
                                            color="warning"
                                            size="small"
                                            className="w-8 h-8 !p-0 flex items-center justify-center"
                                            onClick={() => handleOpenEdit(employee)}
                                        >
                                            <PencilSquare className="w-4 h-4 text-white" />
                                        </Button>
                                        <Button
                                            color="danger"
                                            size="small"
                                            className="w-8 h-8 !p-0 flex items-center justify-center"
                                            onClick={() => handleOpenDelete(employee)}
                                        >
                                            <TrashFill className="w-4 h-4 text-white" />
                                        </Button>
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
            <CreateEmployeeModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreate}
                onSuccess={handleCreateSuccess}
            />
            <EditEmployeeModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEdit}
                employee={selectedEmployee}
                onSuccess={handleCreateSuccess}
            />
            <DeleteEmployeeModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDelete}
                employee={selectedEmployee}
                onSuccess={handleCreateSuccess}
            />
            <EmployeeDetail
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                employee={selectedEmployee}
            />
        </div>
    );
};

export default Employee; 