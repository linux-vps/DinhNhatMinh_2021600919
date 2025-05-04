import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../types/enums.type';

@Injectable()
export class ActivityLogGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Chỉ admin mới được phép truy cập nhật ký
    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Bạn không có quyền truy cập nhật ký hoạt động');
    }

    return true;
  }
} 