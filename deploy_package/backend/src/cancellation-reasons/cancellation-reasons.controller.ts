import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CancellationReasonsService } from './cancellation-reasons.service';
import { CreateCancellationReasonDto } from './dto/create-cancellation-reason.dto';
import { UpdateCancellationReasonDto } from './dto/update-cancellation-reason.dto';

@ApiTags('Cancellation Reasons')
@Controller('cancellation-reasons')
export class CancellationReasonsController {
  constructor(
    private readonly cancellationReasonsService: CancellationReasonsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cancellation reason' })
  @ApiResponse({
    status: 201,
    description: 'The cancellation reason has been successfully created.',
  })
  create(@Body() createCancellationReasonDto: CreateCancellationReasonDto) {
    return this.cancellationReasonsService.create(createCancellationReasonDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all cancellation reasons' })
  @ApiResponse({
    status: 200,
    description: 'Return all cancellation reasons.',
  })
  findAll() {
    return this.cancellationReasonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cancellation reason by ID' })
  @ApiResponse({ status: 200, description: 'Return the cancellation reason.' })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  findOne(@Param('id') id: string) {
    return this.cancellationReasonsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cancellation reason' })
  @ApiResponse({
    status: 200,
    description: 'The cancellation reason has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCancellationReasonDto: UpdateCancellationReasonDto,
  ) {
    return this.cancellationReasonsService.update(
      +id,
      updateCancellationReasonDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cancellation reason' })
  @ApiResponse({
    status: 200,
    description: 'The cancellation reason has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  remove(@Param('id') id: string) {
    return this.cancellationReasonsService.remove(+id);
  }
}
