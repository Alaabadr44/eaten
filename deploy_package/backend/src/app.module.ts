import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZonesModule } from './zones/zones.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { CancellationReasonsModule } from './cancellation-reasons/cancellation-reasons.module';
import { ChatsModule } from './chats/chats.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SystemLogsModule } from './system-logs/system-logs.module';
import { UserContextModule } from './common/user-context/user-context.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserContextInterceptor } from './common/interceptors/user-context.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'catering_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables in dev mode
      }),
      inject: [ConfigService],
    }),
    UserContextModule,
    ZonesModule,
    ServicesModule,
    BookingsModule,
    AdminsModule,
    AuthModule,
    CancellationReasonsModule,
    ChatsModule,
    PermissionsModule,
    SystemLogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserContextInterceptor,
    },
  ],
})
export class AppModule {}
