import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from './staff.dto';

export class StaffQueryParams {
    @IsOptional()
    @IsString()
    readonly fullName?: string;

    @IsOptional()
    @IsString()
    readonly username?: string;
  
    @IsOptional()
    @IsEmail()
    readonly email?: string;
  
    @IsOptional()
    @IsString()
    readonly password?: string;

    @IsOptional()
    @IsString()
    readonly phone?: string;

    @IsOptional()
    @IsString()
    readonly status?: string;

    @IsOptional()
    @IsString()
    readonly role?: Role;
}
