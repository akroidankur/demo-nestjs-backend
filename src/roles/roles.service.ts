import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesQueryParams } from './dto/roles-query-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Roles } from './entities/role.entity';
import { Model } from 'mongoose';
import { RoleExist } from 'src/existbyid.interface';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Roles.name) private readonly roleModel: Model<Roles>) { }

  async createRole(createRoleDto: CreateRoleDto): Promise<Roles | null> {
    try {
      const { roleName, ...roleData } = createRoleDto;
      const roleExists = await this.checkIfRoleExists(roleName);

      if (roleExists) {
        throw new ConflictException('Role with the provided name already exists');
      }

      const createdRole = new this.roleModel({
        roleName,
        ...roleData,
      });

      return await createdRole.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Role already exists');
      }
      throw new InternalServerErrorException('Failed to create role. Please try again later.');
    }
  }

  async checkIfRoleExists(name: string): Promise<boolean> {
    try {
      const existingRole = await this.roleModel.findOne({ roleName: name, deleted: false });

      return !!existingRole;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getAllRoles(): Promise<Roles[]> {
    try {
      const allRoles = await this.roleModel.find().sort({ updatedAt: 'desc' }).exec();
      const activeRoles = allRoles.filter(role => !role.deleted);
      return activeRoles;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getRoleById(id: string): Promise<Roles | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid Role ID');
      }

      const existingRole = await this.roleModel.findById(id).exec();

      if (!existingRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      const activeRole = !existingRole.deleted? existingRole : null;
      return activeRole;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getRoleByParameters(queryParams: RolesQueryParams): Promise<Roles[] | null> {
    try {
      const filteredQueryParams: Record<string, any> = {};

      for (const key in queryParams) {
        if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
          const value = queryParams[key];
          filteredQueryParams[key] = typeof value === 'string' ? value.toLowerCase() : value;
        }
      }
      const result = await this.roleModel.find(filteredQueryParams).sort({ updatedAt: 'desc' }).collation({ locale: 'en', strength: 2 }).exec();
      const activeRole = result.filter(role => !role.deleted);
      return activeRole;
    } catch (error) {
      console.error('Error in get Role By Parameters:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Roles | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid Role ID');
      }

      const findRole = await this.roleModel.findById(id).exec();
      const existingRole = !findRole.deleted? findRole : null;

      if (!existingRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      return await this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteRole(id: string): Promise<Roles | null> {
    try {
      const deletedRole = await this.roleModel.findByIdAndDelete(id).exec();

      if (!deletedRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      return deletedRole as unknown as Roles;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async existsById(id: string): Promise<RoleExist> {
    try {
      this.validateId(id);

      const role = await this.roleModel.findById(id).exec();

      if (role && !role.deleted) {
        const roleExist: RoleExist = {
          exist: true,
          name: role.roleName
        }
        return roleExist;
      }

      
      const roleExist: RoleExist = {
        exist: false,
        name: null
      }
      return roleExist;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  private validateId(id: string): void {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }
}
