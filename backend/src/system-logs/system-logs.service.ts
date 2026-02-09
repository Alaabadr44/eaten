import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog } from './entities/system-log.entity';

@Injectable()
export class SystemLogsService {
  constructor(
    @InjectRepository(SystemLog)
    private logsRepository: Repository<SystemLog>,
  ) {}

  async logAction(
    adminId: string,
    action: string,
    details?: string | object,
    meta?: { targetEntity?: string; targetId?: string },
  ) {
    const log = this.logsRepository.create({
      adminId,
      action,
      details: typeof details === 'object' ? JSON.stringify(details) : details,
      targetEntity: meta?.targetEntity,
      targetId: meta?.targetId,
    });
    return this.logsRepository.save(log);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const [items, total] = await this.logsRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: items, total, page, limit };
  }
}
