import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Payroll } from '../entities/payroll.entity';
import { CreatePayrollDto, UpdatePayrollDto } from '../dtos/payroll.dto';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from 'src/common/types/enums.type';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Leave } from 'src/leaves/entities/leave.entity';
import { LeaveStatus, AttendanceStatus } from 'src/common/types/enums.type';
import { PayrollBonus } from '../entities/payroll-bonus.entity';

/**
 * Service xử lý bảng lương
 */
@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Leave)
    private readonly leaveRepository: Repository<Leave>,
    @InjectRepository(PayrollBonus)
    private readonly payrollBonusRepository: Repository<PayrollBonus>,
  ) {}

  /**
   * Tạo bảng lương mới
   * @param createPayrollDto Thông tin bảng lương
   * @param userId ID người dùng
   * @returns Thông tin bảng lương đã tạo
   */
  async create(createPayrollDto: CreatePayrollDto, userId: string) {
    // Kiểm tra nhân viên tồn tại
    const employee = await this.employeeRepository.findOne({
      where: { id: createPayrollDto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException('Nhân viên không tồn tại');
    }

    // Kiểm tra đã có bảng lương trong tháng này chưa
    const existingPayroll = await this.payrollRepository.findOne({
      where: {
        employeeId: createPayrollDto.employeeId,
        month: createPayrollDto.month,
        year: createPayrollDto.year,
      },
    });
    if (existingPayroll) {
      throw new BadRequestException('Nhân viên đã có bảng lương trong tháng này');
    }

    // Tính lương thực lãnh
    const totalBonus = createPayrollDto.totalBonus || 0;
    const totalDeduction = createPayrollDto.totalDeduction || 0;
    const netSalary = createPayrollDto.baseSalary + totalBonus - totalDeduction;

    // Tạo bảng lương mới
    const payroll = this.payrollRepository.create({
      ...createPayrollDto,
      totalBonus,
      totalDeduction,
      netSalary,
    });
    
    return await this.payrollRepository.save(payroll);
  }

  /**
   * Lấy danh sách bảng lương
   * @param userId ID người dùng
   * @param query Tham số truy vấn
   * @returns Danh sách bảng lương
   */
  async findAll(userId: string, query: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    
    // Xây dựng điều kiện truy vấn
    const where: any = {
      // Mặc định chỉ lấy bản ghi còn hoạt động
      isActive: true
    };
    
    // Nếu không phải admin, chỉ lấy bảng lương của nhân viên đó
    if (user.role !== UserRole.ADMIN) {
      const employee = await this.employeeRepository.findOne({
        where: { email: user.email },
      });
      if (!employee) {
        throw new NotFoundException('Không tìm thấy thông tin nhân viên');
      }
      where.employeeId = employee.id;
    } else if (query.employeeId) {
      // Nếu là admin và có filter theo employeeId
      where.employeeId = query.employeeId;
    }
    
    // Lọc theo tháng và năm
    if (query.month) {
      where.month = query.month;
    }
    
    if (query.year) {
      where.year = query.year;
    }
    
    // Lọc theo khoảng tiền lương
    if (query.minSalary && query.maxSalary) {
      where.netSalary = Between(query.minSalary, query.maxSalary);
    }
    
    // Thực hiện truy vấn
    const payrolls = await this.payrollRepository.find({
      where,
      relations: ['employee'],
      order: {
        year: 'DESC',
        month: 'DESC',
      },
    });
    
    return payrolls;
  }

  /**
   * Lấy thông tin bảng lương theo ID
   * @param id ID bảng lương
   * @param userId ID người dùng
   * @returns Thông tin bảng lương
   */
  async findOne(id: string, userId: string) {
    // Lấy thông tin bảng lương
    const payroll = await this.payrollRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    
    if (!payroll) {
      throw new NotFoundException('Không tìm thấy bảng lương');
    }
    
    return payroll;
  }

  /**
   * Cập nhật thông tin bảng lương
   * @param id ID bảng lương
   * @param updatePayrollDto Thông tin cập nhật
   * @param userId ID người dùng
   * @returns Thông tin bảng lương đã cập nhật
   */
  async update(id: string, updatePayrollDto: UpdatePayrollDto, userId: string) {
    // Kiểm tra bảng lương tồn tại
    const payroll = await this.payrollRepository.findOne({
      where: { id },
    });
    if (!payroll) {
      throw new NotFoundException('Không tìm thấy bảng lương');
    }
    
    // Cập nhật thông tin
    Object.assign(payroll, updatePayrollDto);
    
    // Tính lại lương thực lãnh
    payroll.netSalary = payroll.baseSalary + payroll.totalBonus - payroll.totalDeduction;
    
    return await this.payrollRepository.save(payroll);
  }

  /**
   * Xóa bảng lương
   * @param id ID bảng lương
   * @param userId ID người dùng
   */
  async remove(id: string, userId: string) {
    // Kiểm tra bảng lương tồn tại
    const payroll = await this.payrollRepository.findOne({
      where: { id },
    });
    if (!payroll) {
      throw new NotFoundException('Không tìm thấy bảng lương');
    }
    
    // Sử dụng soft delete thay vì remove
    await this.payrollRepository.softDelete(id);
    
    // Cập nhật trường isActive
    await this.payrollRepository.update(id, { isActive: false });
  }

  /**
   * Tạo bảng lương cho nhân viên
   * @param createPayrollDto Thông tin tạo bảng lương
   * @param userId ID người dùng thực hiện
   * @returns Bảng lương đã tạo
   */
  async generatePayroll(createPayrollDto: CreatePayrollDto, userId: string): Promise<Payroll> {
    const employee = await this.employeeRepository.findOne({
      where: { id: createPayrollDto.employeeId },
    });
    
    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }
    
    // Kiểm tra bảng lương đã tồn tại trong tháng/năm chưa
    const existingPayroll = await this.payrollRepository.findOne({
      where: {
        employeeId: createPayrollDto.employeeId,
        month: createPayrollDto.month,
        year: createPayrollDto.year,
      },
    });
    
    if (existingPayroll) {
      throw new BadRequestException('Bảng lương đã tồn tại cho nhân viên trong tháng này');
    }
    
    // Tính thưởng chuyên cần nếu đi làm đầy đủ
    const attendanceBonus = await this.calculateAttendanceBonus(
      createPayrollDto.employeeId,
      createPayrollDto.month,
      createPayrollDto.year
    );
    
    // Tạo bảng lương mới
    const payroll = this.payrollRepository.create({
      ...createPayrollDto,
      totalBonus: attendanceBonus,
      netSalary: createPayrollDto.baseSalary + attendanceBonus,
    });
    
    return await this.payrollRepository.save(payroll);
  }

  /**
   * Tính thưởng chuyên cần
   * @param employeeId ID nhân viên
   * @param month Tháng
   * @param year Năm
   * @returns Số tiền thưởng
   */
  private async calculateAttendanceBonus(
    employeeId: string,
    month: number,
    year: number,
  ): Promise<number> {
    // Lấy số ngày đi làm trong tháng
    const attendanceCount = await this.attendanceRepository.count({
      where: {
        employeeId,
        status: AttendanceStatus.PRESENT,
        date: Between(
          new Date(year, month - 1, 1),
          new Date(year, month, 0),
        ),
      },
    });
    
    // Lấy số ngày nghỉ có phép
    const leaveCount = await this.leaveRepository.count({
      where: {
        employeeId,
        status: LeaveStatus.APPROVED,
        startDate: LessThanOrEqual(new Date(year, month, 0)),
        endDate: MoreThanOrEqual(new Date(year, month - 1, 1)),
      },
    });
    
    // Tính số ngày làm việc thực tế
    const totalWorkingDays = attendanceCount + leaveCount;
    
    // Nếu đi làm đầy đủ thì thưởng 500k
    if (totalWorkingDays >= 22) {
      return 500000;
    }
    
    return 0;
  }

  /**
   * Tạo bảng lương cho tất cả nhân viên trong tháng hiện tại
   * @param userId ID người dùng thực hiện
   * @returns Danh sách bảng lương đã tạo
   */
  async generateMonthlyPayrolls(userId: string): Promise<Payroll[]> {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // Lấy tất cả nhân viên
    const employees = await this.employeeRepository.find();
    const results: Payroll[] = [];

    // Tạo bảng lương cho từng nhân viên
    for (const employee of employees) {
      const createPayrollDto: CreatePayrollDto = {
        employeeId: employee.id,
        month,
        year,
        baseSalary: employee.salary,
        totalBonus: 0,
        totalDeduction: 0,
      };

      try {
        const payroll = await this.generatePayroll(createPayrollDto, userId);
        results.push(payroll);
      } catch (error) {
        // Bỏ qua lỗi nếu bảng lương đã tồn tại
        if (!(error instanceof BadRequestException)) {
          throw error;
        }
      }
    }

    return results;
  }
} 