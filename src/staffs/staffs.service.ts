import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Staff } from './entities/staff.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { StaffQueryParams } from './dto/staff-query-params.dto';
import { BehaviorSubject } from 'rxjs';
import { RolesService } from 'src/roles/roles.service';
import { StaffExist } from 'src/existbyid.interface';

@Injectable()
export class StaffsService {
  private userId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(@InjectModel(Staff.name) private readonly staffModel: Model<Staff>,
    private readonly roleService: RolesService,
) { }

  async createStaff(createStaffDto: CreateStaffDto): Promise<Staff> {
    try {
      const { password, ...staffData } = createStaffDto;
      const staffExists = await this.checkIfStaffExists(staffData.username, staffData.email, staffData.phone);

      if (staffExists) {
        throw new ConflictException('Staff with the provided username or email already exists');
      }

      if(createStaffDto.role){
        const roleExist = await this.roleService.existsById(createStaffDto.role._id);
        if (!roleExist) {
          throw new NotFoundException('Role does not exist');
        }
        else{
          createStaffDto.role.name = roleExist.name
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createdStaff = new this.staffModel({
        ...staffData,
        password: hashedPassword,
      });

      return await createdStaff.save();
    } catch(error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Username, email or phone already exists OR Role ID does not exist');
      }
      throw new InternalServerErrorException('Failed to create staff. Please try again later.');
    }
  }

  async checkIfStaffExists(username: string, email: string, phone: string): Promise<boolean> {
    try {
      const existingUsername = await this.staffModel.findOne({ username, deleted: false });
      const existingEmail = await this.staffModel.findOne({ email, deleted: false });
      const existingPhone = await this.staffModel.findOne({ phone, deleted: false });

      return !!existingUsername || !!existingEmail || !!existingPhone;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getAllStaffs(): Promise<Staff[]> {
    try {
      const allStaffs = await this.staffModel.find().sort({ updatedAt: 'desc' }).exec();
      const activeStaffs = allStaffs.filter(staff => !staff.deleted);
      return activeStaffs;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getStaffById(id: string): Promise<Staff | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid Staff ID');
      }

      const existingStaff = await this.staffModel.findById(id).exec();

      if (!existingStaff) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }

      const activeStaff = !existingStaff.deleted ? existingStaff : null;
      
      return activeStaff;
    } catch(error) {
      if (error instanceof NotFoundException) {
        console.log('stff serv', error);
        
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getStaffByParameters(queryParams: StaffQueryParams): Promise<Staff[] | null> {
    try {
      const filteredQueryParams: Record<string, any> = {};

      for (const key in queryParams) {
        if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
          const value = queryParams[key];
          filteredQueryParams[key] = typeof value === 'string' ? value.toLowerCase() : value;
        }
      }
      const result = await this.staffModel.find(filteredQueryParams).sort({ updatedAt: 'desc' }).collation({ locale: 'en', strength: 2 }).exec();

      const activeStaff = result.filter(staff => !staff.deleted);
      return activeStaff;
    } catch (error) {
      console.error('Error in get Staff By Parameters:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getStaffByUsername(username: string): Promise<Staff | null> {
    try {
      const existingStaff = await this.staffModel.findOne({ username }).exec();

      if (!existingStaff) {
        throw new NotFoundException(`Staff with username ${username} not found`);
      }

      const activeStaff = !existingStaff.deleted ? existingStaff : null;

      return activeStaff;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getStaffByEmail(email: string): Promise<Staff | null> {
    try {
      const existingStaff = await this.staffModel.findOne({ email }).exec();

      if (!existingStaff) {
        throw new NotFoundException(`Staff with email ${email} not found`);
      }

      const activeStaff = !existingStaff.deleted ? existingStaff : null;

      return activeStaff;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getStaffByPhone(phone: string): Promise<Staff | null> {
    try {
      const existingStaff = await this.staffModel.findOne({ phone }).exec();

      if (!existingStaff) {
        throw new NotFoundException(`Staff with phone ${phone} not found`);
      }

      const activeStaff = !existingStaff.deleted ? existingStaff : null;

      return activeStaff;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async updateStaff(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid Staff ID');
      }

      const findStaff = await this.staffModel.findById(id).exec();
      const existingStaff = !findStaff.deleted ? findStaff : null;

      if (!existingStaff || !findStaff) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }

      if(updateStaffDto.role){
        const roleExist = await this.roleService.existsById(updateStaffDto.role._id);
        if (!roleExist) {
          throw new NotFoundException('Role does not exist');
        }
        else{
          updateStaffDto.role.name = roleExist.name
        }
      }

      if (updateStaffDto.password) {
        const hashedPassword = await bcrypt.hash(updateStaffDto.password, 10);
        updateStaffDto.password = hashedPassword;
      }

      return this.staffModel.findByIdAndUpdate(id, updateStaffDto, { new: true }).exec();
    } catch (error) {
      console.log(error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteStaff(id: string): Promise<Staff | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid Staff ID');
      }

      const deletedStaff = await this.staffModel.findByIdAndDelete(id).exec();

      if (!deletedStaff) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }

      return deletedStaff as unknown as Staff;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async setUserId(userId: string): Promise<void> {
    this.userId.next(userId)
  }

  async getUserId(): Promise<string> {
    return this.userId.value;
  }

  async existsById(id: string): Promise<StaffExist> {
    try {
      this.validateId(id);

      const staff = await this.staffModel.findById(id).exec();

      if (staff && !staff.deleted) {
        const staffExist: StaffExist = {
          exist: true,
          name: staff.fullName
        }
        return staffExist;
      }

      const staffExist: StaffExist = {
        exist: false,
        name: null
      }
      return staffExist;
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
