import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat } from './entities/chat.entity';
export declare class ChatsController {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    create(createChatDto: CreateChatDto): Promise<{
        chatId: string;
        message: import("./entities/chat-message.entity").ChatMessage;
    }>;
    addMessage(id: string, createMessageDto: CreateMessageDto): Promise<{
        message: import("./entities/chat-message.entity").ChatMessage;
    }>;
    findAll(): Promise<Chat[]>;
    findOne(id: string): Promise<Chat>;
}
