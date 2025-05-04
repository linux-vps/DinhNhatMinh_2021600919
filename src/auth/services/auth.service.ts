import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto, RegisterDto, LoginResponseDto } from '../dtos/auth.dto';
import { Employee } from 'src/employees/entities/employee.entity';
import { UserRole } from 'src/common/types/enums.type';

/**
 * Service xử lý xác thực người dùng
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Đăng nhập
   * @param loginDto Thông tin đăng nhập
   * @returns Thông tin người dùng và token
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    
    // Tìm người dùng theo email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    // Tạo JWT token
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      employeeId: user.employeeId,
    };
    
    return {
      userId: user.id,
      employeeId: user.employeeId,
      role: user.role,
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * Đăng ký tài khoản
   * @param registerDto Thông tin đăng ký
   * @returns Thông tin đăng ký
   */
  async register(registerDto: RegisterDto): Promise<{ message: string; userId: string; employeeId?: string }> {
    const { email, password } = registerDto;
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    // Kiểm tra nhân viên với email này đã tồn tại chưa
    const existingEmployee = await this.employeeRepository.findOne({ where: { email } });
    
    if (existingEmployee) {
      // Nếu nhân viên đã tồn tại, tạo tài khoản cho nhân viên đó
      return this.createUserForEmployee(existingEmployee.id, email, password, UserRole.EMPLOYEE);
    } else {
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Tạo nhân viên mới
      const employee = this.employeeRepository.create({
        email,
        firstName: '',
        lastName: '',
      });
      
      await this.employeeRepository.save(employee);
      
      // Tạo người dùng mới
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        employeeId: employee.id,
      });
      
      await this.userRepository.save(user);
      
      return {
        message: 'Đăng ký tài khoản thành công',
        userId: user.id,
        employeeId: employee.id,
      };
    }
  }

  /**
   * Tạo tài khoản cho nhân viên đã tồn tại
   * @param employeeId ID nhân viên
   * @param email Email đăng nhập
   * @param password Mật khẩu
   * @param role Vai trò người dùng
   * @returns Thông tin tạo tài khoản
   */
  async createUserForEmployee(
    employeeId: string, 
    email: string, 
    password: string, 
    role: UserRole = UserRole.EMPLOYEE
  ): Promise<{ message: string; userId: string; employeeId: string }> {
    // Kiểm tra nhân viên tồn tại
    const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
    if (!employee) {
      throw new NotFoundException(`Không tìm thấy nhân viên với ID ${employeeId}`);
    }
    
    // Kiểm tra đã có tài khoản cho nhân viên này chưa
    const existingUser = await this.userRepository.findOne({ where: { employeeId } });
    if (existingUser) {
      throw new BadRequestException(`Nhân viên đã có tài khoản`);
    }
    
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo người dùng mới
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
    });
    
    await this.userRepository.save(user);
    
    return {
      message: 'Tạo tài khoản cho nhân viên thành công',
      userId: user.id,
      employeeId,
    };
  }

  /**
   * Tạo tài khoản Admin
   * @param email Email đăng nhập
   * @param password Mật khẩu
   * @param employeeId ID nhân viên (nếu có)
   * @returns Thông tin tạo tài khoản
   */
  async createAdminUser(
    email: string,
    password: string,
    employeeId?: string
  ): Promise<{ message: string; userId: string; employeeId?: string }> {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }
    
    // Nếu có employeeId, kiểm tra nhân viên tồn tại
    if (employeeId) {
      const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
      if (!employee) {
        throw new NotFoundException(`Không tìm thấy nhân viên với ID ${employeeId}`);
      }
      
      // Kiểm tra đã có tài khoản cho nhân viên này chưa
      const existingUserForEmployee = await this.userRepository.findOne({ where: { employeeId } });
      if (existingUserForEmployee) {
        throw new BadRequestException(`Nhân viên đã có tài khoản`);
      }
    }
    
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo người dùng mới với quyền Admin
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      employeeId,
    });
    
    await this.userRepository.save(user);
    
    return {
      message: 'Tạo tài khoản Admin thành công',
      userId: user.id,
      employeeId,
    };
  }

  /**
   * Lấy thông tin người dùng
   * @param userId ID người dùng
   * @returns Thông tin người dùng
   */
  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['employee'],
    });
    
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    
    return user;
  }
} 