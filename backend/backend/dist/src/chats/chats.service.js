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
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const chat_message_entity_1 = require("./entities/chat-message.entity");
let ChatsService = class ChatsService {
    chatsRepository;
    chatMessagesRepository;
    constructor(chatsRepository, chatMessagesRepository) {
        this.chatsRepository = chatsRepository;
        this.chatMessagesRepository = chatMessagesRepository;
    }
    async create(createChatDto) {
        const chat = this.chatsRepository.create({
            guestId: createChatDto.guestId,
            status: chat_entity_1.ChatStatus.ACTIVE,
        });
        const savedChat = await this.chatsRepository.save(chat);
        const userMessage = this.chatMessagesRepository.create({
            chat: savedChat,
            sender: chat_message_entity_1.MessageSender.USER,
            content: createChatDto.message,
        });
        await this.chatMessagesRepository.save(userMessage);
        return {
            chatId: savedChat.id,
            message: userMessage,
        };
    }
    async findAll() {
        return this.chatsRepository.find({
            relations: ['messages'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async addMessage(chatId, createMessageDto) {
        const chat = await this.chatsRepository.findOne({ where: { id: chatId } });
        if (!chat) {
            throw new common_1.NotFoundException(`Chat with ID ${chatId} not found`);
        }
        const message = this.chatMessagesRepository.create({
            chat: chat,
            sender: createMessageDto.sender,
            content: createMessageDto.message,
        });
        const savedMessage = await this.chatMessagesRepository.save(message);
        return {
            message: savedMessage,
        };
    }
    async findOne(id) {
        const chat = await this.chatsRepository.findOne({
            where: { id },
            relations: ['messages'],
            order: {
                messages: {
                    createdAt: 'ASC',
                },
            },
        });
        if (!chat) {
            throw new common_1.NotFoundException(`Chat with ID ${id} not found`);
        }
        return chat;
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChatsService);
//# sourceMappingURL=chats.service.js.map