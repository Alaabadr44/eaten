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

interface AuditableEntity {
  id?: string | number;
  [key: string]: any;
}

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<AuditableEntity> {
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

  async afterInsert(event: InsertEvent<AuditableEntity>) {
    if (!this.shouldLog(event.entity)) return;

    const adminId = this.userContextService.userId;
    const entityName = event.metadata.name;
    const details = JSON.stringify(event.entity);
    const targetId = event.entity?.id ? String(event.entity.id) : undefined;

    await this.systemLogsService.logAction(
      adminId || 'SYSTEM',
      'CREATE',
      details,
      { targetEntity: entityName, targetId },
    );
  }

  async afterUpdate(event: UpdateEvent<AuditableEntity>) {
    if (!this.shouldLog(event.entity)) return;

    const adminId = this.userContextService.userId;
    const entityName = event.metadata.name;
    const targetId = event.entity?.id ? String(event.entity.id) : undefined;

    // Calculate diff
    const diff = event.updatedColumns.reduce(
      (acc, col) => {
        const key = col.propertyName;
        acc[key] = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          from: event.databaseEntity ? event.databaseEntity[key] : null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          to: event.entity ? event.entity[key] : null,
        };
        return acc;
      },
      {} as Record<string, any>,
    );

    await this.systemLogsService.logAction(
      adminId || 'SYSTEM',
      'UPDATE',
      JSON.stringify(diff),
      { targetEntity: entityName, targetId },
    );
  }

  async afterRemove(event: RemoveEvent<AuditableEntity>) {
    if (!this.shouldLog(event.entity)) return;

    const adminId = this.userContextService.userId;
    const entityName = event.metadata.name;

    let targetId: string | undefined;
    if (event.entityId) {
      targetId = String(event.entityId);
    } else if (event.entity?.id) {
      targetId = String(event.entity.id);
    }

    await this.systemLogsService.logAction(
      adminId || 'SYSTEM',
      'DELETE',
      JSON.stringify(event.entity),
      { targetEntity: entityName, targetId },
    );
  }
}
