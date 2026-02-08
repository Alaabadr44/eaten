import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { ZonesService } from '../zones/zones.service';
import { CancellationReasonsService } from '../cancellation-reasons/cancellation-reasons.service';
export declare class BookingsService {
    private readonly bookingRepository;
    private readonly zonesService;
    private readonly cancellationReasonsService;
    constructor(bookingRepository: Repository<Booking>, zonesService: ZonesService, cancellationReasonsService: CancellationReasonsService);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(page?: number, limit?: number): Promise<{
        items: Booking[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    remove(id: string): Promise<Booking>;
    cancel(id: string, reasonIdOrText: string | number): Promise<Booking>;
}
