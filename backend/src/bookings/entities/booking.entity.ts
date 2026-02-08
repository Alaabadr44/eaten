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
  LESS_THAN_5 = 'LESS_THAN_5',
  BETWEEN_5_AND_20 = 'BETWEEN_5_AND_20',
  MORE_THAN_20 = 'MORE_THAN_20',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderReference: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @Column({
    type: 'enum',
    enum: EventCapacity,
    default: EventCapacity.BETWEEN_5_AND_20,
  })
  eventCapacity: EventCapacity;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  eventDate: Date;

  @Column()
  eventTime: string;

  @Column({ nullable: true })
  locationUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @ManyToOne(() => Zone, { eager: true })
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;

  @Column()
  zoneId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
