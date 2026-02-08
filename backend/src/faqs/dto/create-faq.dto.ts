import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ description: 'The question' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ description: 'The answer' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({
    description: 'Is the FAQ active?',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
