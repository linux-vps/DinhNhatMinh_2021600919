import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from '../entities/feed.entity';
import { CreateFeedDto, UpdateFeedDto } from '../dtos/feed.dto';
import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/auth/entities/user.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { UserRole } from 'src/common/types/enums.type';

/**
 * Service xử lý thông báo (Feed)
 */
@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * Tạo thông báo mới
   * @param createFeedDto Thông tin thông báo
   * @param userId ID người dùng
   * @returns Thông tin thông báo đã tạo
   */
  async create(createFeedDto: CreateFeedDto, userId: string) {
    try {
      // Kiểm tra người dùng tồn tại
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }

      // Kiểm tra phòng ban tồn tại nếu có
      if (createFeedDto.departmentId) {
        const department = await this.departmentRepository.findOne({
          where: { id: createFeedDto.departmentId },
        });
        if (!department) {
          throw new NotFoundException('Không tìm thấy phòng ban');
        }
      }

      // Tạo thông báo mới
      const feed = this.feedRepository.create({
        ...createFeedDto,
        createdById: userId,
        timestamp: new Date(),
        isActive: true,
      });
      
      return await this.feedRepository.save(feed);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Không thể tạo thông báo: ' + error.message);
    }
  }

  /**
   * Lấy danh sách thông báo
   * @param userId ID người dùng
   * @returns Danh sách thông báo
   */
  async findAll(userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }
      
      let feeds: Feed[];
      
      // Nếu là admin, lấy tất cả thông báo
      if (user.role === UserRole.ADMIN) {
        feeds = await this.feedRepository.find({
          where: { isActive: true },
          relations: ['createdBy', 'department'],
          order: {
            isImportant: 'DESC',
            timestamp: 'DESC',
          },
        });
      } else {
        // Nếu là nhân viên, chỉ lấy thông báo toàn cục và thông báo của phòng ban của nhân viên đó
        const employee = await this.employeeRepository.findOne({
          where: { email: user.email },
        });
        if (!employee) {
          throw new NotFoundException('Không tìm thấy thông tin nhân viên');
        }
        
        feeds = await this.feedRepository
          .createQueryBuilder('feed')
          .leftJoinAndSelect('feed.createdBy', 'createdBy')
          .leftJoinAndSelect('feed.department', 'department')
          .where('(feed.departmentId IS NULL OR feed.departmentId = :departmentId) AND feed.isActive = :isActive', {
            departmentId: employee.departmentId,
            isActive: true
          })
          .orderBy('feed.isImportant', 'DESC')
          .addOrderBy('feed.timestamp', 'DESC')
          .getMany();
      }
      
      return feeds;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Không thể lấy danh sách thông báo: ' + error.message);
    }
  }

  /**
   * Lấy thông tin thông báo
   * @param id ID thông báo
   * @param userId ID người dùng
   * @returns Thông tin thông báo
   */
  async findOne(id: string, userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }
      
      // Lấy thông tin thông báo
      const feed = await this.feedRepository.findOne({
        where: { id },
        relations: ['createdBy', 'department'],
      });
      
      if (!feed) {
        throw new NotFoundException('Không tìm thấy thông báo');
      }
      
      // Nếu không phải admin và thông báo thuộc phòng ban, kiểm tra xem nhân viên có thuộc phòng ban này không
      if (user.role !== UserRole.ADMIN && feed.departmentId) {
        const employee = await this.employeeRepository.findOne({
          where: { email: user.email },
        });
        if (!employee || employee.departmentId !== feed.departmentId) {
          throw new BadRequestException('Bạn không có quyền xem thông báo này');
        }
      }
      
      return feed;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Không thể lấy thông tin thông báo: ' + error.message);
    }
  }

  /**
   * Cập nhật thông tin thông báo
   * @param id ID thông báo
   * @param updateFeedDto Thông tin cập nhật
   * @param userId ID người dùng
   * @returns Thông tin thông báo đã cập nhật
   */
  async update(id: string, updateFeedDto: UpdateFeedDto, userId: string) {
    try {
      // Kiểm tra thông báo tồn tại
      const feed = await this.feedRepository.findOne({
        where: { id },
      });
      if (!feed) {
        throw new NotFoundException('Không tìm thấy thông báo');
      }
      
      // Kiểm tra phòng ban tồn tại nếu có
      if (updateFeedDto.departmentId) {
        const department = await this.departmentRepository.findOne({
          where: { id: updateFeedDto.departmentId },
        });
        if (!department) {
          throw new NotFoundException('Không tìm thấy phòng ban');
        }
      }
      
      // Cập nhật thông tin
      Object.assign(feed, updateFeedDto);
      
      return await this.feedRepository.save(feed);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Không thể cập nhật thông báo: ' + error.message);
    }
  }

  /**
   * Xóa thông báo
   * @param id ID thông báo
   * @param userId ID người dùng
   */
  async remove(id: string, userId: string) {
    try {
      // Kiểm tra thông báo tồn tại
      const feed = await this.feedRepository.findOne({
        where: { id },
      });
      if (!feed) {
        throw new NotFoundException('Không tìm thấy thông báo');
      }
      
      // Sử dụng soft delete thay vì remove
      await this.feedRepository.softDelete(id);
      
      // Cập nhật trường isActive
      await this.feedRepository.update(id, { isActive: false });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Không thể xóa thông báo: ' + error.message);
    }
  }

  /**
   * Lấy danh sách thông báo theo phòng ban
   * @param departmentId ID phòng ban
   * @param userId ID người dùng
   * @returns Danh sách thông báo
   */
  async findByDepartment(departmentId: string, userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }
      
      // Kiểm tra phòng ban tồn tại
      const department = await this.departmentRepository.findOne({
        where: { id: departmentId },
      });
      if (!department) {
        throw new NotFoundException('Không tìm thấy phòng ban');
      }
      
      // Nếu không phải admin, kiểm tra xem nhân viên có thuộc phòng ban này không
      if (user.role !== UserRole.ADMIN) {
        const employee = await this.employeeRepository.findOne({
          where: { email: user.email },
        });
        if (!employee || employee.departmentId !== departmentId) {
          throw new BadRequestException('Bạn không có quyền xem thông báo của phòng ban này');
        }
      }
      
      // Lấy thông báo của phòng ban
      const feeds = await this.feedRepository.find({
        where: { 
          departmentId,
          isActive: true 
        },
        relations: ['createdBy', 'department'],
        order: {
          isImportant: 'DESC',
          timestamp: 'DESC',
        },
      });
      
      return feeds;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Không thể lấy danh sách thông báo theo phòng ban: ' + error.message);
    }
  }
} 