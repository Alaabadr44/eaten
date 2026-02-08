import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
  ) {}

  async findOne(email: string): Promise<Admin | null> {
    return this.adminsRepository.findOne({ where: { email } });
  }

  async create(email: string, passwordHash: string): Promise<Admin> {
    const admin = this.adminsRepository.create({ email, passwordHash });
    return this.adminsRepository.save(admin);
  }
}
