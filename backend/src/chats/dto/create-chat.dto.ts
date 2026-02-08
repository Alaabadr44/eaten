import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'The ID of the guest user',
    example: 'guest-12345',
  })
  @IsNotEmpty()
  @IsString()
  guestId: string;

  @ApiProperty({
    description: 'The initial message to start the chat',
    example: 'Hello, I have a question about catering.',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
