import { PartialType } from '@nestjs/swagger';
import { CreateCancellationReasonDto } from './create-cancellation-reason.dto';

export class UpdateCancellationReasonDto extends PartialType(CreateCancellationReasonDto) {}
