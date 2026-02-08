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
exports.CancellationReasonsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cancellation_reason_entity_1 = require("./entities/cancellation-reason.entity");
let CancellationReasonsService = class CancellationReasonsService {
    reasonRepository;
    constructor(reasonRepository) {
        this.reasonRepository = reasonRepository;
    }
    create(createCancellationReasonDto) {
        const reason = this.reasonRepository.create(createCancellationReasonDto);
        return this.reasonRepository.save(reason);
    }
    findAll() {
        return this.reasonRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const reason = await this.reasonRepository.findOneBy({ id });
        if (!reason) {
            throw new common_1.NotFoundException(`Cancellation reason with ID ${id} not found`);
        }
        return reason;
    }
    async update(id, updateCancellationReasonDto) {
        const reason = await this.findOne(id);
        Object.assign(reason, updateCancellationReasonDto);
        return this.reasonRepository.save(reason);
    }
    async remove(id) {
        const reason = await this.findOne(id);
        return this.reasonRepository.remove(reason);
    }
};
exports.CancellationReasonsService = CancellationReasonsService;
exports.CancellationReasonsService = CancellationReasonsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cancellation_reason_entity_1.CancellationReason)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CancellationReasonsService);
//# sourceMappingURL=cancellation-reasons.service.js.map