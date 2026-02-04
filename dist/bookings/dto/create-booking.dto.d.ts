import { EventType } from '../entities/booking.entity';
export declare class CreateBookingDto {
    eventType: EventType;
    eventDate: string;
    eventTime: string;
    zoneId: string;
    locationUrl?: string;
    description?: string;
}
