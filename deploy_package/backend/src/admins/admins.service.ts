import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { Permission } from '../permissions/entities/permission.entity';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const existing = await this.findOne(createAdminDto.email);
    if (existing) {
        throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createAdminDto.password, salt);

    const admin = this.adminsRepository.create({
        email: createAdminDto.email,
        passwordHash,
    });

    if (createAdminDto.permissionIds) {
        const permissions = await this.permissionsRepository.findBy({
            id: In(createAdminDto.permissionIds),
        });
        admin.permissions = permissions;
    }

    return this.adminsRepository.save(admin);
  }

  async findAll(): Promise<Admin[]> {
    return this.adminsRepository.find({
        relations: ['permissions'],
        select: ['id', 'email', 'createdAt', 'updatedAt'], // Exclude passwordHash
    });
  }

  async findOne(email: string): Promise<Admin | null> {
    return this.adminsRepository.findOne({ 
        where: { email },
        relations: ['permissions'],
    });
  }

   async findOneById(id: string): Promise<Admin> {
    const admin = await this.adminsRepository.findOne({ 
        where: { id },
        relations: ['permissions'],
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOneById(id);
    
    if (updateAdminDto.password) {
        const salt = await bcrypt.genSalt();
        admin.passwordHash = await bcrypt.hash(updateAdminDto.password, salt);
    }
    
    if (updateAdminDto.permissionIds) {
         const permissions = await this.permissionsRepository.findBy({
            id: In(updateAdminDto.permissionIds),
        });
        admin.permissions = permissions;
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password, permissionIds, ...rest } = updateAdminDto; 
    Object.assign(admin, rest);
    
    await this.adminsRepository.save(admin);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = admin;
    return result as Admin;
  }

  async remove(id: string): Promise<void> {
    const result = await this.adminsRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }
}
