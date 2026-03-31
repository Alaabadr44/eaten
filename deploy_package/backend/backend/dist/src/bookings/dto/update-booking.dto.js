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
exports.UpdateBookingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_booking_dto_1 = require("./create-booking.dto");
const class_validator_1 = require("class-validator");
const booking_entity_1 = require("../entities/booking.entity");
const swagger_1 = require("@nestjs/swagger");
class UpdateBookingDto extends (0, mapped_types_1.PartialType)(create_booking_dto_1.CreateBookingDto) {
    status;
    adminNotes;
}
exports.UpdateBookingDto = UpdateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: booking_entity_1.BookingStatus,
        required: false,
        description: 'Status of the booking',
    }),
    (0, class_validator_1.IsEnum)(booking_entity_1.BookingStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBookingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Internal admin notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBookingDto.prototype, "adminNotes", void 0);
//# sourceMappingURL=update-booking.dto.js.map