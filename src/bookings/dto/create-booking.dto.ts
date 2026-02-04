import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { EventType } from '../entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ enum: EventType, description: 'Type of event' })
  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;

  @ApiProperty({
    description: 'Date of event (ISO 8601)',
    example: '2026-12-25',
  })
  @IsDateString()
  @IsNotEmpty()
  eventDate: string; // ISO Date string

  @ApiProperty({ description: 'Time of event', example: '19:00' })
  @IsString()
  @IsNotEmpty()
  eventTime: string;

  @ApiProperty({ description: 'ID of the zone', example: 'uuid-string' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  zoneId: string;

  @ApiProperty({ description: 'Google Maps URL', required: false })
  @IsUrl()
  @IsOptional()
  locationUrl?: string;

  @ApiProperty({ description: 'Additional details', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
