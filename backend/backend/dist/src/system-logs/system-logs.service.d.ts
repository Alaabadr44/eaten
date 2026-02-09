import { Repository } from 'typeorm';
import { SystemLog } from './entities/system-log.entity';
export declare class SystemLogsService {
    private logsRepository;
    constructor(logsRepository: Repository<SystemLog>);
    logAction(adminId: string, action: string, details?: string | object, meta?: {
        targetEntity?: string;
        targetId?: string;
    }): Promise<SystemLog>;
    findAll(page?: number, limit?: number): Promise<{
        data: SystemLog[];
        total: number;
        page: number;
        limit: number;
    }>;
}
