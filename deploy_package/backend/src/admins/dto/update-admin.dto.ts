import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsArray, IsOptional, IsUUID, MinLength, IsString } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;
    
    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    permissionIds?: string[];
}
