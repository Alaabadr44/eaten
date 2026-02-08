import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCancellationReasonDto } from './dto/create-cancellation-reason.dto';
import { UpdateCancellationReasonDto } from './dto/update-cancellation-reason.dto';
import { CancellationReason } from './entities/cancellation-reason.entity';

@Injectable()
export class CancellationReasonsService {
  constructor(
    @InjectRepository(CancellationReason)
    private readonly reasonRepository: Repository<CancellationReason>,
  ) {}

  create(createCancellationReasonDto: CreateCancellationReasonDto) {
    const reason = this.reasonRepository.create(createCancellationReasonDto);
    return this.reasonRepository.save(reason);
  }

  findAll() {
    return this.reasonRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const reason = await this.reasonRepository.findOneBy({ id });
    if (!reason) {
      throw new NotFoundException(
        `Cancellation reason with ID ${id} not found`,
      );
    }
    return reason;
  }

  async update(
    id: number,
    updateCancellationReasonDto: UpdateCancellationReasonDto,
  ) {
    const reason = await this.findOne(id);
    Object.assign(reason, updateCancellationReasonDto);
    return this.reasonRepository.save(reason);
  }

  async remove(id: number) {
    const reason = await this.findOne(id);
    return this.reasonRepository.remove(reason);
  }
}
