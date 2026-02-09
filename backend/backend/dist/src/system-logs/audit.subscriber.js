"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditSubscriber = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const system_logs_service_1 = require("./system-logs.service");
const user_context_service_1 = require("../common/user-context/user-context.service");
const system_log_entity_1 = require("./entities/system-log.entity");
let AuditSubscriber = class AuditSubscriber {
    systemLogsService;
    userContextService;
    constructor(dataSource, systemLogsService, userContextService) {
        this.systemLogsService = systemLogsService;
        this.userContextService = userContextService;
        dataSource.subscribers.push(this);
    }
    shouldLog(entity) {
        return !(entity instanceof system_log_entity_1.SystemLog);
    }
    async afterInsert(event) {
        if (!this.shouldLog(event.entity))
            return;
        const adminId = this.userContextService.userId;
        const entityName = event.metadata.name;
        const details = JSON.stringify(event.entity);
        const targetId = event.entity.id ? String(event.entity.id) : null;
        await this.systemLogsService.logAction(adminId || 'SYSTEM', `CREATE`, `Created ${entityName}`, { targetEntity: entityName, targetId, details });
    }
    async afterUpdate(event) {
        if (!this.shouldLog(event.entity))
            return;
        const adminId = this.userContextService.userId;
        const entityName = event.metadata.name;
        const targetId = event.entity ? String(event.entity.id) : null;
        const diff = event.updatedColumns.reduce((acc, col) => {
            const key = col.propertyName;
            acc[key] = {
                from: event.databaseEntity[key],
                to: event.entity[key]
            };
            return acc;
        }, {});
        await this.systemLogsService.logAction(adminId || 'SYSTEM', `UPDATE`, `Updated ${entityName}`, { targetEntity: entityName, targetId, details: JSON.stringify(diff) });
    }
    async afterRemove(event) {
        if (!this.shouldLog(event.entity))
            return;
        const adminId = this.userContextService.userId;
        const entityName = event.metadata.name;
        const targetId = event.entityId ? String(event.entityId) : (event.entity ? String(event.entity.id) : null);
        await this.systemLogsService.logAction(adminId || 'SYSTEM', `DELETE`, `Deleted ${entityName}`, { targetEntity: entityName, targetId, details: JSON.stringify(event.entity) });
    }
};
exports.AuditSubscriber = AuditSubscriber;
exports.AuditSubscriber = AuditSubscriber = __decorate([
    (0, common_1.Injectable)(),
    (0, typeorm_1.EventSubscriber)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        system_logs_service_1.SystemLogsService,
        user_context_service_1.UserContextService])
], AuditSubscriber);
//# sourceMappingURL=audit.subscriber.js.map