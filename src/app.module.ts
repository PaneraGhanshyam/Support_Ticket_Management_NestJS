import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory:(config:ConfigService) =>({
        type:'mysql',
        host: config.get<string>('DB_HOST','localhost'),
        port:config.get<number>('DB_PORT',3306),
        username: config.get<string>('DB_USERNAME','root'),
        password:config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true, 
        synchronize:true,
      }),
    }),

    AuthModule,

    UsersModule,
    TicketsModule,
  ],
})
export class AppModule {}