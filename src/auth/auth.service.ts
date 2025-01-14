import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { StaffsService } from 'src/staffs/staffs.service';
import { RolesService } from 'src/roles/roles.service';
import { User } from './dto/user.interface';
import { Roles } from 'src/roles/dto/permissions.interface';
import { Staff } from 'src/staffs/entities/staff.entity';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffsService,
    private jwtService: JwtService,
    private rolesService: RolesService
  ) { }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    try {
      const { username, email, phone, password } = loginDto;
      let staff: Staff;

      if (username) {
        staff = await this.staffService.getStaffByUsername(username);
      }
      else if (email) {
        staff = await this.staffService.getStaffByEmail(email);
      }
      else if (phone) {
        staff = await this.staffService.getStaffByPhone(phone);
      }

      if (!staff) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const isPasswordMatched: boolean = await bcrypt.compare(password, staff.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid username or password');
      } 

      const roleIdInString: string = staff.role._id.toString();
      
      const roles: Roles = await this.rolesService.getRoleById(roleIdInString);

      const token: string = this.jwtService.sign({ id: staff._id });

      console.log(token);
      
      const user: User = {
        _id: staff._id as unknown as string,
        username: staff.username,
        email: staff.email,
        phone: staff.phone,
        roleID: staff.role._id,
        roleName: roles.roleName,
        permissions: roles.rolePermissions,
        fullName: staff.fullName
      };

      return { token, user };
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
