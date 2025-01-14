import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from './dto/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto,): Promise<{ user: User; token: string }> {
    try {
      return await this.authService.login(loginDto);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
