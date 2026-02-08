import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({
    enum: BookingStatus,
    required: false,
    description: 'Status of the booking',
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({ required: false, description: 'Internal admin notes' })
  @IsString()
  @IsOptional()
  adminNotes?: string;
}
