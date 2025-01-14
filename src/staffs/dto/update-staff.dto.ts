import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './create-staff.dto';
import { IsBoolean, IsEmail, IsObject, IsOptional, IsString } from 'class-validator';
import { Role } from './staff.dto';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
    @IsOptional()
    @IsString()
    readonly fullName?: string;

    @IsOptional()
    @IsString()
    username?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    readonly status?: string;

    @IsOptional()
    @IsObject()
    readonly role?: Role;

    @IsOptional()
    @IsBoolean()
    readonly deleted?: boolean;
}
