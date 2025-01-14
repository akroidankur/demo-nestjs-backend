import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;
  
    @IsNotEmpty()
    @IsString()
    readonly phone: string;
  
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
