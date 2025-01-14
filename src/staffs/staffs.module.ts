import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from './entities/staff.entity';
import { StaffsMiddleware } from './staffs.middleware';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => RolesModule),
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
  ],
  controllers: [StaffsController],
  providers: [StaffsService],
  exports: [StaffsService],
})
export class StaffsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StaffsMiddleware).forRoutes('staffs*')
  }
}
