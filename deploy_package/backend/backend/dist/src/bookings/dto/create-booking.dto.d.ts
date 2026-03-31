import { EventType, EventCapacity } from '../entities/booking.entity';
export declare class CreateBookingDto {
    eventType: EventType;
    eventCapacity: EventCapacity;
    name: string;
    phone: string;
    eventDate: string;
    eventTime: string;
    zoneId: number;
    locationUrl?: string;
    description?: string;
}
