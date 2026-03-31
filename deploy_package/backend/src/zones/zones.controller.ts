import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Zones')
@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new zone' })
  @ApiResponse({
    status: 201,
    description: 'The zone has been successfully created.',
  })
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zonesService.create(createZoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all zones' })
  @ApiResponse({ status: 200, description: 'Return all zones.' })
  findAll() {
    return this.zonesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a zone by ID' })
  @ApiResponse({ status: 200, description: 'Return the zone.' })
  @ApiResponse({ status: 404, description: 'Zone not found.' })
  @Get(':id')
  @ApiOperation({ summary: 'Get a zone by ID' })
  @ApiResponse({ status: 200, description: 'Return the zone.' })
  @ApiResponse({ status: 404, description: 'Zone not found.' })
  findOne(@Param('id') id: string) {
    return this.zonesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a zone' })
  @ApiResponse({
    status: 200,
    description: 'The zone has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Zone not found.' })
  update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zonesService.update(+id, updateZoneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a zone' })
  @ApiResponse({
    status: 200,
    description: 'The zone has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Zone not found.' })
  remove(@Param('id') id: string) {
    return this.zonesService.remove(+id);
  }
}
