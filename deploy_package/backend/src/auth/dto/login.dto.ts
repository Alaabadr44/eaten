import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com', description: 'Admin email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Admin password' })
  @IsNotEmpty()
  password: string;
}
