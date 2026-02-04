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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const zones_service_1 = require("../zones/zones.service");
let BookingsService = class BookingsService {
    bookingRepository;
    zonesService;
    constructor(bookingRepository, zonesService) {
        this.bookingRepository = bookingRepository;
        this.zonesService = zonesService;
    }
    async create(createBookingDto) {
        const zone = await this.zonesService.findOne(createBookingDto.zoneId);
        if (!zone.isActive) {
            throw new common_1.BadRequestException('Cannot book in an inactive zone');
        }
        const eventDate = new Date(createBookingDto.eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventDate < today) {
            throw new common_1.BadRequestException('Event date cannot be in the past');
        }
        const booking = this.bookingRepository.create({
            ...createBookingDto,
            eventDate,
        });
        return this.bookingRepository.save(booking);
    }
    findAll() {
        return this.bookingRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const booking = await this.bookingRepository.findOneBy({ id });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async update(id, updateBookingDto) {
        const booking = await this.findOne(id);
        if (updateBookingDto.eventDate) {
            const eventDate = new Date(updateBookingDto.eventDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (eventDate < today) {
                throw new common_1.BadRequestException('Event date cannot be in the past');
            }
            booking.eventDate = eventDate;
            delete updateBookingDto.eventDate;
        }
        Object.assign(booking, updateBookingDto);
        return this.bookingRepository.save(booking);
    }
    async remove(id) {
        const booking = await this.findOne(id);
        return this.bookingRepository.remove(booking);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        zones_service_1.ZonesService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map