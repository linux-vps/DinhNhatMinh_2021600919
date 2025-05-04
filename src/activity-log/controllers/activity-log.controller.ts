import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityLogResponseDto, ActivityLogQueryDto } from '../dtos/activity-log.dto';
import { Request } from 'express';
import { createSuccessResponse } from 'src/common/dtos/api-response.dto';
import { ActivityLogGuard } from 'src/common/guards/activity-log.guard';

/**
 * Controller xử lý nhật ký hoạt động
 */
@ApiTags('Nhật ký hoạt động')
@ApiBearerAuth('JWT-auth')
@Controller('activity-log')
@UseGuards(ActivityLogGuard)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  /**
   * Lấy danh sách nhật ký hoạt động
   * @param req Request object
   * @param query Tham số truy vấn
   * @returns Danh sách nhật ký hoạt động
   */
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhật ký hoạt động' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách nhật ký hoạt động thành công',
    type: [ActivityLogResponseDto],
  })
  async findAll(@Req() req: Request, @Query() query: ActivityLogQueryDto) {
    const userId = (req as any).user.id;
    const activityLogs = await this.activityLogService.findAll(userId, query);
    return createSuccessResponse('Lấy danh sách nhật ký hoạt động thành công', activityLogs);
  }

  /**
   * Lấy danh sách nhật ký hoạt động theo người dùng
   * @param userId ID người dùng
   * @param req Request object
   * @param query Tham số truy vấn
   * @returns Danh sách nhật ký hoạt động
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy danh sách nhật ký hoạt động theo người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách nhật ký hoạt động thành công',
    type: [ActivityLogResponseDto],
  })
  async findByUser(@Param('userId') userId: string, @Req() req: Request, @Query() query: ActivityLogQueryDto) {
    const requestUserId = (req as any).user.id;
    const activityLogs = await this.activityLogService.findByUser(userId, requestUserId, query);
    return createSuccessResponse('Lấy danh sách nhật ký hoạt động thành công', activityLogs);
  }

  /**
   * Xóa nhật ký hoạt động cũ
   * @param days Số ngày cần giữ lại
   * @param req Request object
   * @returns Thông báo xóa thành công
   */
  @Delete('old/:days')
  @ApiOperation({ summary: 'Xóa nhật ký hoạt động cũ' })
  @ApiResponse({
    status: 200,
    description: 'Xóa nhật ký hoạt động thành công',
  })
  async deleteOldLogs(@Param('days') days: number, @Req() req: Request) {
    const userId = (req as any).user.id;
    const count = await this.activityLogService.deleteOldLogs(days, userId);
    return createSuccessResponse(`Đã xóa ${count} bản ghi nhật ký hoạt động cũ`);
  }
} 