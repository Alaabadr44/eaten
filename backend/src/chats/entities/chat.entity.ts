import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ChatMessage } from './chat-message.entity.js';

export enum ChatStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

@Entity()
export class Chat {
  @ApiProperty({ example: 'uuid-string' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'guest-123' })
  @Column({ nullable: false })
  guestId: string;

  @ApiProperty({ enum: ChatStatus })
  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.ACTIVE,
  })
  status: ChatStatus;

  @ApiProperty({ type: () => [ChatMessage] })
  @OneToMany(() => ChatMessage, (message) => message.chat, { cascade: true })
  messages: ChatMessage[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
