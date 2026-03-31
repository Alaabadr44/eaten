import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';
import { ZonesService } from '../zones/zones.service';
import { CancellationReasonsService } from '../cancellation-reasons/cancellation-reasons.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly zonesService: ZonesService,
    private readonly cancellationReasonsService: CancellationReasonsService,
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

    // Generate Short ID
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
    const orderReference = `BK-${nanoid()}`;

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      eventDate, // Store as Date object
      orderReference,
    });
    return this.bookingRepository.save(booking);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [items, total] = await this.bookingRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id,
      );

    const booking = isUuid
      ? await this.bookingRepository.findOneBy({ id })
      : await this.bookingRepository.findOneBy({ orderReference: id });

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

  async cancel(id: string, reasonId: number) {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;

    try {
      const reason = await this.cancellationReasonsService.findOne(reasonId);
      booking.cancellationReason = reason.reason;
    } catch {
      throw new BadRequestException('Invalid cancellation reason ID');
    }

    return this.bookingRepository.save(booking);
  }
}
