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
exports.ZonesController = void 0;
const common_1 = require("@nestjs/common");
const zones_service_1 = require("./zones.service");
const create_zone_dto_1 = require("./dto/create-zone.dto");
const update_zone_dto_1 = require("./dto/update-zone.dto");
const swagger_1 = require("@nestjs/swagger");
let ZonesController = class ZonesController {
    zonesService;
    constructor(zonesService) {
        this.zonesService = zonesService;
    }
    create(createZoneDto) {
        return this.zonesService.create(createZoneDto);
    }
    findAll() {
        return this.zonesService.findAll();
    }
    findOne(id) {
        return this.zonesService.findOne(+id);
    }
    update(id, updateZoneDto) {
        return this.zonesService.update(+id, updateZoneDto);
    }
    remove(id) {
        return this.zonesService.remove(+id);
    }
};
exports.ZonesController = ZonesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new zone' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The zone has been successfully created.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_zone_dto_1.CreateZoneDto]),
    __metadata("design:returntype", void 0)
], ZonesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all zones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all zones.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ZonesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a zone by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the zone.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Zone not found.' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a zone by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the zone.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Zone not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ZonesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a zone' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The zone has been successfully updated.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Zone not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_zone_dto_1.UpdateZoneDto]),
    __metadata("design:returntype", void 0)
], ZonesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a zone' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The zone has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Zone not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ZonesController.prototype, "remove", null);
exports.ZonesController = ZonesController = __decorate([
    (0, swagger_1.ApiTags)('Zones'),
    (0, common_1.Controller)('zones'),
    __metadata("design:paramtypes", [zones_service_1.ZonesService])
], ZonesController);
//# sourceMappingURL=zones.controller.js.map