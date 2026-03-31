import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class ChatsService {
    private chatsRepository;
    private chatMessagesRepository;
    constructor(chatsRepository: Repository<Chat>, chatMessagesRepository: Repository<ChatMessage>);
    create(createChatDto: CreateChatDto): Promise<{
        chatId: string;
        message: ChatMessage;
    }>;
    findAll(): Promise<Chat[]>;
    addMessage(chatId: string, createMessageDto: CreateMessageDto): Promise<{
        message: ChatMessage;
    }>;
    findOne(id: string): Promise<Chat>;
}
