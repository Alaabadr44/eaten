import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { SystemLogsService } from './system-logs.service';

@Controller('system-logs')
export class SystemLogsController {
  constructor(private readonly logsService: SystemLogsService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.logsService.findAll(page, limit);
  }
}
