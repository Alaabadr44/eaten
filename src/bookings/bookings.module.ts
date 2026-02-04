import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { ZonesModule } from '../zones/zones.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), ZonesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
