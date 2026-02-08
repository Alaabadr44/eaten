import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { ZonesModule } from '../zones/zones.module';
import { CancellationReasonsModule } from '../cancellation-reasons/cancellation-reasons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ZonesModule,
    CancellationReasonsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
