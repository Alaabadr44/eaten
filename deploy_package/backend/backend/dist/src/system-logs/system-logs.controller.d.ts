import { SystemLogsService } from './system-logs.service';
export declare class SystemLogsController {
    private readonly logsService;
    constructor(logsService: SystemLogsService);
    findAll(page: number, limit: number): Promise<{
        data: import("./entities/system-log.entity").SystemLog[];
        total: number;
        page: number;
        limit: number;
    }>;
}
