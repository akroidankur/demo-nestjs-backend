import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { PermissionsDto } from './permissions.dto';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    readonly roleName: string;

    @IsString()
    @IsOptional()
    readonly roleDescription?: string;

    @IsObject()
    @IsNotEmpty()
    readonly rolePermissions: PermissionsDto;
}