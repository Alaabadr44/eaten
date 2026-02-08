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
exports.FaqsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const faq_entity_1 = require("./entities/faq.entity");
let FaqsService = class FaqsService {
    faqRepository;
    constructor(faqRepository) {
        this.faqRepository = faqRepository;
    }
    create(createFaqDto) {
        const faq = this.faqRepository.create(createFaqDto);
        return this.faqRepository.save(faq);
    }
    findAll(isAdmin = false) {
        if (isAdmin) {
            return this.faqRepository.find({ order: { createdAt: 'ASC' } });
        }
        return this.faqRepository.find({
            where: { isActive: true },
            order: { createdAt: 'ASC' },
            select: ['id', 'question', 'answer'],
        });
    }
    async findOne(id) {
        const faq = await this.faqRepository.findOneBy({ id });
        if (!faq) {
            throw new common_1.NotFoundException(`FAQ with ID ${id} not found`);
        }
        return faq;
    }
    async update(id, updateFaqDto) {
        const faq = await this.findOne(id);
        Object.assign(faq, updateFaqDto);
        return this.faqRepository.save(faq);
    }
    async remove(id) {
        const faq = await this.findOne(id);
        return this.faqRepository.remove(faq);
    }
};
exports.FaqsService = FaqsService;
exports.FaqsService = FaqsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(faq_entity_1.Faq)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FaqsService);
//# sourceMappingURL=faqs.service.js.map