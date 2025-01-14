import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RolesSchema } from './entities/role.entity';
import { StaffsModule } from 'src/staffs/staffs.module';
import { RolesMiddleware } from './roles.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => StaffsModule),
    MongooseModule.forFeature([{ name: Roles.name, schema: RolesSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RolesMiddleware).forRoutes('roles*')
  }
}
