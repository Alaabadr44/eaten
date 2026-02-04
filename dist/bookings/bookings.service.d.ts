import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { ZonesService } from '../zones/zones.service';
export declare class BookingsService {
    private readonly bookingRepository;
    private readonly zonesService;
    constructor(bookingRepository: Repository<Booking>, zonesService: ZonesService);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    remove(id: string): Promise<Booking>;
}
