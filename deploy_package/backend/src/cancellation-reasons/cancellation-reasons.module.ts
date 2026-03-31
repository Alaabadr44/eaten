import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancellationReasonsService } from './cancellation-reasons.service';
import { CancellationReasonsController } from './cancellation-reasons.controller';
import { CancellationReason } from './entities/cancellation-reason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CancellationReason])],
  controllers: [CancellationReasonsController],
  providers: [CancellationReasonsService],
  exports: [CancellationReasonsService], // Export service to be used in Bookings module
})
export class CancellationReasonsModule {}
