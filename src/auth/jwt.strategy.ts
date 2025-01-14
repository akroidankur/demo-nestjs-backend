import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { StaffsService } from 'src/staffs/staffs.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public userId: string = '';

  constructor(private staffService: StaffsService) {    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });

    console.log('JWT_SECRET:', process.env.JWT_SECRET);

  }

  async validate(payload: any) {
    try {
      this.userId = payload.id;
    
      const staff = await this.staffService.getStaffById(this.userId);
      
      if (!staff) {
        throw new UnauthorizedException('Invalid Staff');
      }

      return staff;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
