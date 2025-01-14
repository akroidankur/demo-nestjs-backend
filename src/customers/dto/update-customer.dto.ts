import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @IsOptional()
    @IsString()
    readonly fullName?: string;

    @IsOptional()
    @IsString()
    readonly phone?: string;

    @IsOptional()
    @IsString()
    password?: string;
}
