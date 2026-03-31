import { DataSource, EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { SystemLogsService } from './system-logs.service';
import { UserContextService } from '../common/user-context/user-context.service';
export declare class AuditSubscriber implements EntitySubscriberInterface {
    private readonly systemLogsService;
    private readonly userContextService;
    constructor(dataSource: DataSource, systemLogsService: SystemLogsService, userContextService: UserContextService);
    shouldLog(entity: any): boolean;
    afterInsert(event: InsertEvent<any>): Promise<void>;
    afterUpdate(event: UpdateEvent<any>): Promise<void>;
    afterRemove(event: RemoveEvent<any>): Promise<void>;
}
