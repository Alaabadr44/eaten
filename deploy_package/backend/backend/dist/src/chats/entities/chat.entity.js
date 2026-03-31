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
exports.Chat = exports.ChatStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const chat_message_entity_js_1 = require("./chat-message.entity.js");
var ChatStatus;
(function (ChatStatus) {
    ChatStatus["ACTIVE"] = "ACTIVE";
    ChatStatus["CLOSED"] = "CLOSED";
})(ChatStatus || (exports.ChatStatus = ChatStatus = {}));
let Chat = class Chat {
    id;
    guestId;
    status;
    messages;
    createdAt;
    updatedAt;
};
exports.Chat = Chat;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-string' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Chat.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guest-123' }),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Chat.prototype, "guestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ChatStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChatStatus,
        default: ChatStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Chat.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [chat_message_entity_js_1.ChatMessage] }),
    (0, typeorm_1.OneToMany)(() => chat_message_entity_js_1.ChatMessage, (message) => message.chat, { cascade: true }),
    __metadata("design:type", Array)
], Chat.prototype, "messages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Chat.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Chat.prototype, "updatedAt", void 0);
exports.Chat = Chat = __decorate([
    (0, typeorm_1.Entity)()
], Chat);
//# sourceMappingURL=chat.entity.js.map