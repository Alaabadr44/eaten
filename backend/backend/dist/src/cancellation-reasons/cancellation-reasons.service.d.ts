import { Repository } from 'typeorm';
import { CreateCancellationReasonDto } from './dto/create-cancellation-reason.dto';
import { UpdateCancellationReasonDto } from './dto/update-cancellation-reason.dto';
import { CancellationReason } from './entities/cancellation-reason.entity';
export declare class CancellationReasonsService {
    private readonly reasonRepository;
    constructor(reasonRepository: Repository<CancellationReason>);
    create(createCancellationReasonDto: CreateCancellationReasonDto): Promise<CancellationReason>;
    findAll(): Promise<CancellationReason[]>;
    findOne(id: number): Promise<CancellationReason>;
    update(id: number, updateCancellationReasonDto: UpdateCancellationReasonDto): Promise<CancellationReason>;
    remove(id: number): Promise<CancellationReason>;
}
