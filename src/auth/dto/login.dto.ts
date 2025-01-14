import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  readonly username?: string

  @IsOptional()
  @IsString()
  readonly email?: string

  @IsOptional()
  @IsString()
  readonly phone?: string

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
