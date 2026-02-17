import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Zone } from '../../zones/entities/zone.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum EventType {
  PRIVATE = 'PRIVATE',
  CORPORATE = 'CORPORATE',
}

export enum EventCapacity {
  LESS_THAN_5 = 1,
  BETWEEN_5_AND_20 = 2,
  MORE_THAN_20 = 3,
}

@Entity()
export class Booking {
  @ApiProperty({ description: 'The unique UUID of the booking' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The unique order reference (e.g. BK-X1Y2Z3)' })
  @Column({ unique: true })
  orderReference: string;

  @ApiProperty({ enum: EventType, description: 'The type of the event' })
  @Column({
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @ApiProperty({
    enum: EventCapacity,
    description: 'The capacity of the event',
  })
  @Column({
    type: 'enum',
    enum: EventCapacity,
    default: EventCapacity.BETWEEN_5_AND_20,
  })
  eventCapacity: EventCapacity;

  @ApiProperty({
    description: 'The name of the contact person',
    required: false,
  })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    description: 'The phone number of the contact person',
    required: false,
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ description: 'The date of the event' })
  @Column()
  eventDate: Date;

  @ApiProperty({ description: 'The time of the event' })
  @Column()
  eventTime: string;

  @ApiProperty({ description: 'The Google Maps URL', required: false })
  @Column({ nullable: true })
  locationUrl: string;

  @ApiProperty({
    description: 'Additional details about the event',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    enum: BookingStatus,
    description: 'The current status of the booking',
  })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'The reason for cancellation, if cancelled',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @ApiProperty({ description: 'Admin notes', required: false })
  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @ApiProperty({
    type: () => Zone,
    description: 'The zone where the event will be held',
  })
  @ManyToOne(() => Zone, { eager: true })
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;

  @ApiProperty({ description: 'The ID of the zone' })
  @Column()
  zoneId: number;

  @ApiProperty({ description: 'The creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
