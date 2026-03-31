"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationReasonsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cancellation_reasons_service_1 = require("./cancellation-reasons.service");
const cancellation_reasons_controller_1 = require("./cancellation-reasons.controller");
const cancellation_reason_entity_1 = require("./entities/cancellation-reason.entity");
let CancellationReasonsModule = class CancellationReasonsModule {
};
exports.CancellationReasonsModule = CancellationReasonsModule;
exports.CancellationReasonsModule = CancellationReasonsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cancellation_reason_entity_1.CancellationReason])],
        controllers: [cancellation_reasons_controller_1.CancellationReasonsController],
        providers: [cancellation_reasons_service_1.CancellationReasonsService],
        exports: [cancellation_reasons_service_1.CancellationReasonsService],
    })
], CancellationReasonsModule);
//# sourceMappingURL=cancellation-reasons.module.js.map