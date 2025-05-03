import React, { useState, useEffect } from 'react';
import { PlusLg, PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { Button, Card, Table, Pagination, Select } from "@/components/reactdash-ui";
import APIService from '@/services/APIService';
import CreateSalaryModal from '@/components/modals/CreateSalaryModal';
import EditSalaryModal from '@/components/modals/EditSalaryModal';
import DeleteSalaryModal from '@/components/modals/DeleteSalaryModal';

export default function SalaryList() {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchSalaries = async (page = 1) => {
        try {
            setLoading(true);
            const response = await APIService.getSalaries(page, selectedMonth, selectedYear);
            setSalaries(response.data);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách lương');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalaries(currentPage);
    }, [currentPage, selectedMonth, selectedYear]);

    const handleCreate = async (salaryData) => {
        try {
            await APIService.createSalary(salaryData);
            fetchSalaries(currentPage);
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = async (id, salaryData) => {
        try {
            await APIService.updateSalary(id, salaryData);
            fetchSalaries(currentPage);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await APIService.deleteSalary(id);
            fetchSalaries(currentPage);
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const months = [
        { value: 1, label: 'Tháng 1' },
        { value: 2, label: 'Tháng 2' },
        { value: 3, label: 'Tháng 3' },
        { value: 4, label: 'Tháng 4' },
        { value: 5, label: 'Tháng 5' },
        { value: 6, label: 'Tháng 6' },
        { value: 7, label: 'Tháng 7' },
        { value: 8, label: 'Tháng 8' },
        { value: 9, label: 'Tháng 9' },
        { value: 10, label: 'Tháng 10' },
        { value: 11, label: 'Tháng 11' },
        { value: 12, label: 'Tháng 12' }
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý lương</h1>
                <div className="flex space-x-4">
                    <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </Select>
                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </Select>
                    <Button
                        color="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <PlusLg className="inline-block w-4 h-4 mr-2" />
                        Thêm lương
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nhân viên</th>
                            <th>Tháng</th>
                            <th>Lương cơ bản</th>
                            <th>Phụ cấp</th>
                            <th>Thưởng</th>
                            <th>Khấu trừ</th>
                            <th>Tổng lương</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : salaries.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            salaries.map((salary) => (
                                <tr key={salary.id}>
                                    <td>{salary.id}</td>
                                    <td>{salary.employee?.name}</td>
                                    <td>{new Date(salary.month).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</td>
                                    <td>{salary.basic_salary.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>{salary.allowance.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>{salary.bonus.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>{salary.deduction.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>{salary.total_salary.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            salary.status === 'paid' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {salary.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <Button
                                                color="warning"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSalary(salary);
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                <PencilSquare className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSalary(salary);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            >
                                                <TrashFill className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <CreateSalaryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
            />

            <EditSalaryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEdit}
                salary={selectedSalary}
            />

            <DeleteSalaryModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onSubmit={handleDelete}
                salary={selectedSalary}
            />
        </div>
    );
} 