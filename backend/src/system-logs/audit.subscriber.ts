import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SystemLogsService } from './system-logs.service';
import { UserContextService } from '../common/user-context/user-context.service';
import { SystemLog } from './entities/system-log.entity';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(
    dataSource: DataSource,
    private readonly systemLogsService: SystemLogsService,
    private readonly userContextService: UserContextService,
  ) {
    dataSource.subscribers.push(this);
  }

  // Skip logging for SystemLog entity itself to avoid infinite loops
  shouldLog(entity: any): boolean {
    return !(entity instanceof SystemLog);
  }

  async afterInsert(event: InsertEvent<any>) {
    if (!this.shouldLog(event.entity)) return;
    
    const adminId = this.userContextService.userId;
    const entityName = event.metadata.name;
    const details = JSON.stringify(event.entity);
    const targetId = event.entity.id ? String(event.entity.id) : null;

    await this.systemLogsService.logAction(
      adminId || 'SYSTEM',
      `CREATE`,
      `Created ${entityName}`,
      { targetEntity: entityName, targetId, details }
    );
  }

  async afterUpdate(event: UpdateEvent<any>) {
    if (!this.shouldLog(event.entity)) return;

    const adminId = this.userContextService.userId;
    const entityName = event.metadata.name;
    const targetId = event.entity ? String(event.entity.id) : null;
    
    // Calculate diff
    const diff = event.updatedColumns.reduce((acc, col) => {
        const key = col.propertyName;
        acc[key] = {
            from: event.databaseEntity[key],
            to: event.entity[key]
        };
        return acc;
    }, {} as Record<string, any>);

    await this.systemLogsService.logAction(
      adminId || 'SYSTEM',
      `UPDATE`,
      `Updated ${entityName}`,
      { targetEntity: entityName, targetId, details: JSON.stringify(diff) }
    );
  }

  async afterRemove(event: RemoveEvent<any>) {
    // Start of Request
    if (!this.shouldLog(event.entity)) return;

    const adminId = this.userContextService.userId;
    const entityName = event.metadata.name;
    const targetId = event.entityId ? String(event.entityId) : (event.entity ? String(event.entity.id) : null);

    await this.systemLogsService.logAction(
      adminId || 'SYSTEM',
      `DELETE`,
      `Deleted ${entityName}`,
      { targetEntity: entityName, targetId, details: JSON.stringify(event.entity) }
    );
  }
}
