import { Chat } from './chat.entity.js';
export declare enum MessageSender {
    USER = "USER",
    BOT = "BOT"
}
export declare class ChatMessage {
    id: string;
    sender: MessageSender;
    content: string;
    chat: Chat;
    chatId: string;
    createdAt: Date;
}
