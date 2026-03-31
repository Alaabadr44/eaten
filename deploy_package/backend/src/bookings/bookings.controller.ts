import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking request' })
  @ApiResponse({
    status: 201,
    description: 'The booking has been successfully created.',
    type: Booking,
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all bookings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all bookings.' }) // Pagination response type is complex to define, skipping for now unless needed
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.bookingsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the booking.',
    type: Booking,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully updated.',
    type: Booking,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully deleted.',
    type: Booking,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking with reason' })
  @ApiBody({ type: CancelBookingDto })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully cancelled.',
    type: Booking,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  cancel(@Param('id') id: string, @Body() cancelBookingDto: CancelBookingDto) {
    return this.bookingsService.cancel(id, cancelBookingDto.reasonId);
  }
}
