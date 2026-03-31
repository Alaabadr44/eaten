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
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chats_service_1 = require("./chats.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const create_message_dto_1 = require("./dto/create-message.dto");
const chat_entity_1 = require("./entities/chat.entity");
let ChatsController = class ChatsController {
    chatsService;
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    create(createChatDto) {
        return this.chatsService.create(createChatDto);
    }
    addMessage(id, createMessageDto) {
        return this.chatsService.addMessage(id, createMessageDto);
    }
    findAll() {
        return this.chatsService.findAll();
    }
    findOne(id) {
        return this.chatsService.findOne(id);
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new chat session' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The chat has been successfully created.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message to an existing chat' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The message has been successfully sent.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all chats (Admin)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return list of chats.',
        type: [chat_entity_1.Chat],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat history' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return the chat history.',
        type: chat_entity_1.Chat,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "findOne", null);
exports.ChatsController = ChatsController = __decorate([
    (0, swagger_1.ApiTags)('Chats'),
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map