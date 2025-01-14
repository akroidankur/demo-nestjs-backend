import { IsString, IsEmail, IsNotEmpty, IsObject } from 'class-validator';
import { Role } from './staff.dto';

export class CreateStaffDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsString()
    readonly username: string;
  
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
  
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly status: string;

    @IsNotEmpty()
    @IsObject()
    readonly role: Role;
}
