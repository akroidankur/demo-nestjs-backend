import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ConflictException, InternalServerErrorException, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesQueryParams } from './dto/roles-query-params.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  async createRole(@Body(ValidationPipe) createRoleDto: CreateRoleDto) {
    try {
      return await this.rolesService.createRole(createRoleDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Role with the provided name already exists');
      }
      throw new InternalServerErrorException('Failed to create role. Please try again later.');
    }
  }

  @Get()
  async getAllRoles() {
    try {
      return await this.rolesService.getAllRoles();
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('search')
  async getRolesByParameters(@Query() queryParams: RolesQueryParams) {
    try {
      return await this.rolesService.getRoleByParameters(queryParams);
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get(':id')
  async getRolesById(@Param('id') id: string) {
    try {
      const role = await this.rolesService.getRoleById(id);
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Patch(':id')
  async updateRole(@Param('id') id: string, @Body(ValidationPipe) updateRoleDto: UpdateRoleDto) {
    try {
      const updatedRole = await this.rolesService.updateRole(id, updateRoleDto);
      if (!updatedRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return updatedRole;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    try {
      const deletedRole = await this.rolesService.deleteRole(id);
      if (!deletedRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return { message: 'Role deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
