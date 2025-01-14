import { IsOptional, IsString } from 'class-validator';

export class CustomerQueryParamsDto{
    @IsOptional()
    @IsString()
    readonly firstName?: string;

    @IsOptional()
    @IsString()
    readonly middleName?: string;

    @IsOptional()
    @IsString()
    readonly lastName?: string;

    @IsOptional()
    @IsString()
    readonly phone?: string;
}
