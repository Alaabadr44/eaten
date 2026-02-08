import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageSender } from '../entities/chat-message.entity';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The message content',
    example: 'Do you offer vegan options?',
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
