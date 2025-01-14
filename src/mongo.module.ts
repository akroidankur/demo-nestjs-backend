import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],

            useFactory: async (configService: ConfigService) => {
              const uri = configService.get<string>('MONGO_CONNECT');
              console.log('Mongo URI:', uri);
              return { uri };
            },
            
            // useFactory: async (configService: ConfigService) => ({
            //   uri: configService.get<string>('MONGO_CONNECT'),
            // }),
            inject: [ConfigService],
          }),
    ]
})
export class MongoModule {}
