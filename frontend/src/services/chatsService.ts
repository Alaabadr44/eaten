import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'BOT';
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  guestId: string;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
  messages: ChatMessage[];
}

export const chatsService = {
  async getAllChats(): Promise<Chat[]> {
    const response = await axios.get(`${API_URL}/chats`);
    return response.data.data;
  },

  async getChatById(id: string): Promise<Chat> {
    const response = await axios.get(`${API_URL}/chats/${id}`);
    return response.data.data;
  },
};
