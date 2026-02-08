import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
export declare class FaqsController {
    private readonly faqsService;
    constructor(faqsService: FaqsService);
    create(createFaqDto: CreateFaqDto): Promise<import("./entities/faq.entity").Faq>;
    findAll(admin?: string): Promise<import("./entities/faq.entity").Faq[]>;
    findOne(id: string): Promise<import("./entities/faq.entity").Faq>;
    update(id: string, updateFaqDto: UpdateFaqDto): Promise<import("./entities/faq.entity").Faq>;
    remove(id: string): Promise<import("./entities/faq.entity").Faq>;
}
