import { CancellationReasonsService } from './cancellation-reasons.service';
import { CreateCancellationReasonDto } from './dto/create-cancellation-reason.dto';
import { UpdateCancellationReasonDto } from './dto/update-cancellation-reason.dto';
export declare class CancellationReasonsController {
    private readonly cancellationReasonsService;
    constructor(cancellationReasonsService: CancellationReasonsService);
    create(createCancellationReasonDto: CreateCancellationReasonDto): Promise<import("./entities/cancellation-reason.entity").CancellationReason>;
    findAll(): Promise<import("./entities/cancellation-reason.entity").CancellationReason[]>;
    findOne(id: string): Promise<import("./entities/cancellation-reason.entity").CancellationReason>;
    update(id: string, updateCancellationReasonDto: UpdateCancellationReasonDto): Promise<import("./entities/cancellation-reason.entity").CancellationReason>;
    remove(id: string): Promise<import("./entities/cancellation-reason.entity").CancellationReason>;
}
