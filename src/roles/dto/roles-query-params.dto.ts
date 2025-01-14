import { IsString, IsOptional, IsObject } from 'class-validator';
import { PermissionsDto } from './permissions.dto';

export class RolesQueryParams {
    @IsString()
    @IsOptional()
    readonly roleName?: string;

    @IsString()
    @IsOptional()
    readonly roleDescription?: string;

    @IsObject()
    @IsOptional()
    readonly rolePermissions?: PermissionsDto;
}