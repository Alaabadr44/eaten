import { Repository } from 'typeorm';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';
export declare class FaqsService {
    private readonly faqRepository;
    constructor(faqRepository: Repository<Faq>);
    create(createFaqDto: CreateFaqDto): Promise<Faq>;
    findAll(isAdmin?: boolean): Promise<Faq[]>;
    findOne(id: string): Promise<Faq>;
    update(id: string, updateFaqDto: UpdateFaqDto): Promise<Faq>;
    remove(id: string): Promise<Faq>;
}
