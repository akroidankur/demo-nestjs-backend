import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import { PermissionsDto } from './permissions.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsString()
    @IsOptional()
    readonly roleName?: string;

    @IsString()
    @IsOptional()
    readonly roleDescription?: string;

    @IsObject()
    @IsOptional()
    readonly rolePermissions?: PermissionsDto;

    @IsOptional()
    @IsBoolean()
    readonly deleted?: boolean;
}