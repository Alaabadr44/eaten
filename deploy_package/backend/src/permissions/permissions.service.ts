import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: any) {
    const permission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async findAll() {
    return this.permissionsRepository.find();
  }

  async findOne(id: string) {
    const permission = await this.permissionsRepository.findOneBy({ id });
    if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }
  
  async update(id: string, updatePermissionDto: any) {
    const permission = await this.findOne(id);
    Object.assign(permission, updatePermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async remove(id: string) {
    const result = await this.permissionsRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
