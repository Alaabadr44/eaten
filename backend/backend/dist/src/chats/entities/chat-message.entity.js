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
exports.ChatMessage = exports.MessageSender = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const chat_entity_js_1 = require("./chat.entity.js");
var MessageSender;
(function (MessageSender) {
    MessageSender["USER"] = "USER";
    MessageSender["BOT"] = "BOT";
})(MessageSender || (exports.MessageSender = MessageSender = {}));
let ChatMessage = class ChatMessage {
    id;
    sender;
    content;
    chat;
    chatId;
    createdAt;
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-string' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: MessageSender }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageSender,
    }),
    __metadata("design:type", String)
], ChatMessage.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello world' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_entity_js_1.Chat, (chat) => chat.messages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'chatId' }),
    __metadata("design:type", chat_entity_js_1.Chat)
], ChatMessage.prototype, "chat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'chat-uuid-string' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatMessage.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChatMessage.prototype, "createdAt", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)()
], ChatMessage);
//# sourceMappingURL=chat-message.entity.js.map