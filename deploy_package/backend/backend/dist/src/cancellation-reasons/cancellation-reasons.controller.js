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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationReasonsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cancellation_reasons_service_1 = require("./cancellation-reasons.service");
const create_cancellation_reason_dto_1 = require("./dto/create-cancellation-reason.dto");
const update_cancellation_reason_dto_1 = require("./dto/update-cancellation-reason.dto");
let CancellationReasonsController = class CancellationReasonsController {
    cancellationReasonsService;
    constructor(cancellationReasonsService) {
        this.cancellationReasonsService = cancellationReasonsService;
    }
    create(createCancellationReasonDto) {
        return this.cancellationReasonsService.create(createCancellationReasonDto);
    }
    findAll() {
        return this.cancellationReasonsService.findAll();
    }
    findOne(id) {
        return this.cancellationReasonsService.findOne(+id);
    }
    update(id, updateCancellationReasonDto) {
        return this.cancellationReasonsService.update(+id, updateCancellationReasonDto);
    }
    remove(id) {
        return this.cancellationReasonsService.remove(+id);
    }
};
exports.CancellationReasonsController = CancellationReasonsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new cancellation reason' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The cancellation reason has been successfully created.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cancellation_reason_dto_1.CreateCancellationReasonDto]),
    __metadata("design:returntype", void 0)
], CancellationReasonsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all cancellation reasons' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return all cancellation reasons.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CancellationReasonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a cancellation reason by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the cancellation reason.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reason not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CancellationReasonsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a cancellation reason' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The cancellation reason has been successfully updated.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reason not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cancellation_reason_dto_1.UpdateCancellationReasonDto]),
    __metadata("design:returntype", void 0)
], CancellationReasonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a cancellation reason' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The cancellation reason has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reason not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CancellationReasonsController.prototype, "remove", null);
exports.CancellationReasonsController = CancellationReasonsController = __decorate([
    (0, swagger_1.ApiTags)('Cancellation Reasons'),
    (0, common_1.Controller)('cancellation-reasons'),
    __metadata("design:paramtypes", [cancellation_reasons_service_1.CancellationReasonsService])
], CancellationReasonsController);
//# sourceMappingURL=cancellation-reasons.controller.js.map