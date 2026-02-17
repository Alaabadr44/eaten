import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiProperty({ description: 'ID of the cancellation reason', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  reasonId: number;
}
