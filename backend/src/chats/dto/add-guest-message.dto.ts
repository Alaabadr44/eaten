import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageSender } from '../entities/chat-message.entity';

export class AddGuestMessageDto {
  @ApiProperty({
    description: 'The conversation ID (guest ID)',
    example: 'conv_12345',
  })
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'The message content',
    example: 'Hello!',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The sender of the message',
    enum: MessageSender,
    example: MessageSender.USER,
  })
  @IsNotEmpty()
  @IsEnum(MessageSender)
  sender: MessageSender;
}
