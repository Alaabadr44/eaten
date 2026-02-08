import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Chat } from './chat.entity.js';

export enum MessageSender {
  USER = 'USER',
  BOT = 'BOT',
}

@Entity()
export class ChatMessage {
  @ApiProperty({ example: 'uuid-string' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: MessageSender })
  @Column({
    type: 'enum',
    enum: MessageSender,
  })
  sender: MessageSender;

  @ApiProperty({ example: 'Hello world' })
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @ApiProperty({ example: 'chat-uuid-string' })
  @Column()
  chatId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
