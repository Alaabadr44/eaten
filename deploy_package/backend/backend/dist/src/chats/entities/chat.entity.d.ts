import { ChatMessage } from './chat-message.entity.js';
export declare enum ChatStatus {
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED"
}
export declare class Chat {
    id: string;
    guestId: string;
    status: ChatStatus;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}
