import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './entities/customer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StaffsModule } from 'src/staffs/staffs.module';
import { RolesModule } from 'src/roles/roles.module';
import { CustomersMiddleware } from './customers.middleware';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => StaffsModule),
    forwardRef(() => RolesModule),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService]
})
export class CustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomersMiddleware).forRoutes('customers*')
  }
}
