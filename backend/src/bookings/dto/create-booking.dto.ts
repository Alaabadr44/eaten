import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUrl,
  IsNumber,
} from 'class-validator';
import { EventType, EventCapacity } from '../entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ enum: EventType, description: 'Type of event' })
  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;

  @ApiProperty({
    enum: EventCapacity,
    description: 'Number of people attending',
  })
  @IsEnum(EventCapacity)
  @IsNotEmpty()
  eventCapacity: EventCapacity;

  @ApiProperty({ description: 'Contact name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

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

  @ApiProperty({ description: 'ID of the zone', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  zoneId: number;

  @ApiProperty({ description: 'Google Maps URL', required: false })
  @IsUrl()
  @IsOptional()
  locationUrl?: string;

  @ApiProperty({ description: 'Additional details', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
