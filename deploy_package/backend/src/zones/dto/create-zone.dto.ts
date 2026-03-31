import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZoneDto {
  @ApiProperty({ description: 'The name of the zone', example: 'Downtown' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Is the zone currently active?',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
