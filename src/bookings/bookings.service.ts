import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { ZonesService } from '../zones/zones.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly zonesService: ZonesService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    // Validate Zone
    const zone = await this.zonesService.findOne(createBookingDto.zoneId);
    if (!zone.isActive) {
      throw new BadRequestException('Cannot book in an inactive zone');
    }

    // Validate Date (must be future)
    const eventDate = new Date(createBookingDto.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      throw new BadRequestException('Event date cannot be in the past');
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      eventDate, // Store as Date object
    });
    return this.bookingRepository.save(booking);
  }

  findAll() {
    return this.bookingRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    // If updating date, validate again?
    if (updateBookingDto.eventDate) {
      const eventDate = new Date(updateBookingDto.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        throw new BadRequestException('Event date cannot be in the past');
      }
      // Update the date object
      booking.eventDate = eventDate;
      delete updateBookingDto.eventDate; // Remove string version
    }

    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async remove(id: string) {
    const booking = await this.findOne(id);
    return this.bookingRepository.remove(booking);
  }
}
