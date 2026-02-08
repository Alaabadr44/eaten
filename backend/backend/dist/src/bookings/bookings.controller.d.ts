import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    findAll(page: number, limit: number): Promise<{
        items: import("./entities/booking.entity").Booking[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/booking.entity").Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    remove(id: string): Promise<import("./entities/booking.entity").Booking>;
    cancel(id: string, cancelBookingDto: CancelBookingDto): Promise<import("./entities/booking.entity").Booking>;
}
