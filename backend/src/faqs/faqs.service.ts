import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  create(createFaqDto: CreateFaqDto) {
    const faq = this.faqRepository.create(createFaqDto);
    return this.faqRepository.save(faq);
  }

  findAll(isAdmin: boolean = false) {
    if (isAdmin) {
      return this.faqRepository.find({ order: { createdAt: 'ASC' } });
    }
    return this.faqRepository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
      select: ['id', 'question', 'answer'],
    });
  }

  async findOne(id: string) {
    const faq = await this.faqRepository.findOneBy({ id });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    const faq = await this.findOne(id);
    Object.assign(faq, updateFaqDto);
    return this.faqRepository.save(faq);
  }

  async remove(id: string) {
    const faq = await this.findOne(id);
    return this.faqRepository.remove(faq);
  }
}
