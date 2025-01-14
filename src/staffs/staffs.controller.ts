import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, ConflictException, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffQueryParams } from './dto/staff-query-params.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) { }

  @Post()
  async createStaff(@Body(ValidationPipe) createStaffDto: CreateStaffDto) {
    try {
      return await this.staffsService.createStaff(createStaffDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Username, email or phone already exists');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get()
  async getAllStaffs() {
    try {
      return await this.staffsService.getAllStaffs();
    } catch{
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('search')
  async getStaffsByParameters(@Query() queryParams: StaffQueryParams) {
    try {
      return await this.staffsService.getStaffByParameters(queryParams);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get(':id')
  async getStaffById(@Param('id') id: string) {
    try {
      return await this.staffsService.getStaffById(id);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('username/:username')
  async getStaffByUsername(@Param('username') username: string) {
    try {
      return await this.staffsService.getStaffByUsername(username);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('email/:email')
  async getStaffByEmail(@Param('email') email: string) {
    try {
      return await this.staffsService.getStaffByEmail(email);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Patch(':id')
  async updateStaff(@Param('id') id: string, @Body(ValidationPipe) updateStaffDto: UpdateStaffDto) {
    try {
      console.log(updateStaffDto);
      
      return await this.staffsService.updateStaff(id, updateStaffDto);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Delete(':id')
  async deleteStaff(@Param('id') id: string) {
    try {
      await this.staffsService.deleteStaff(id);
      return { message: 'Staff deleted successfully' };
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
