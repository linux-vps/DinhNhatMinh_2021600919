import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../types/enums.type';

@Injectable()
export class PayrollGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Nếu là admin thì cho phép truy cập tất cả
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Nếu là user thường, kiểm tra employeeId
    if (!user.employeeId) {
      throw new BadRequestException('Người dùng không có thông tin nhân viên');
    }

    // Lấy employeeId từ request
    const employeeId = request.params.employeeId || request.body.employeeId;
    
    // Nếu có employeeId trong request, kiểm tra xem có phải của user này không
    if (employeeId && employeeId !== user.employeeId) {
      throw new BadRequestException('Bạn không có quyền truy cập bảng lương của nhân viên khác');
    }

    // Nếu không có employeeId trong request, thêm employeeId của user vào request
    if (!employeeId) {
      request.body.employeeId = user.employeeId;
    }

    return true;
  }
} 