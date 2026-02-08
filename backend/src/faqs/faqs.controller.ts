import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new FAQ' })
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  @Get()
  @ApiOperation({ summary: 'List FAQs' })
  @ApiQuery({ name: 'admin', required: false, type: Boolean })
  findAll(@Query('admin') admin?: string) {
    const isAdmin = admin === 'true';
    return this.faqsService.findAll(isAdmin);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a FAQ by ID' })
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a FAQ' })
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(id, updateFaqDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a FAQ' })
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}
