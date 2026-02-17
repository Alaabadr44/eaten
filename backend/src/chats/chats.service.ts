import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, ChatStatus } from './entities/chat.entity';
import { ChatMessage, MessageSender } from './entities/chat-message.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { AddGuestMessageDto } from './dto/add-guest-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    // 1. Create the chat session
    const chat = this.chatsRepository.create({
      guestId: createChatDto.guestId,
      status: ChatStatus.ACTIVE,
    });
    const savedChat = await this.chatsRepository.save(chat);

    // 2. Add the user's initial message
    const userMessage = this.chatMessagesRepository.create({
      chat: savedChat,
      sender: MessageSender.USER,
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

  async addMessage(chatId: string, createMessageDto: CreateMessageDto) {
    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // 1. Save message with specified sender
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

  async processGuestMessage(dto: AddGuestMessageDto) {
    let chat = await this.chatsRepository.findOne({
      where: { guestId: dto.conversationId, status: ChatStatus.ACTIVE },
    });

    if (!chat) {
      chat = this.chatsRepository.create({
        guestId: dto.conversationId,
        status: ChatStatus.ACTIVE,
      });
      chat = await this.chatsRepository.save(chat);
    }

    const message = this.chatMessagesRepository.create({
      chat: chat,
      sender: dto.sender,
      content: dto.message,
    });

    return await this.chatMessagesRepository.save(message);
  }

  async findOne(id: string) {
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
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }
}
