import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './mongo.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { JwtService } from '@nestjs/jwt';
import { GlobalMiddleware } from './global.middleware';
import { RolesModule } from './roles/roles.module';
import { StaffsModule } from './staffs/staffs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongoModule,
    AuthModule,
    StaffsModule,
    RolesModule,
    CustomersModule
  ],
  controllers: [AppController],
  providers: [JwtService, AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GlobalMiddleware)
      .exclude(
        { path: 'auth/*', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}