import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat } from './entities/chat.entity';

@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new chat session' })
  @ApiResponse({
    status: 201,
    description: 'The chat has been successfully created.',
  })
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message to an existing chat' })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully sent.',
  })
  addMessage(
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatsService.addMessage(id, createMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all chats (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Return list of chats.',
    type: [Chat],
  })
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiResponse({
    status: 200,
    description: 'Return the chat history.',
    type: Chat,
  })
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }
}
