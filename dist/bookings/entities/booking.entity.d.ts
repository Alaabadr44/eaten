import { Zone } from '../../zones/entities/zone.entity';
export declare enum BookingStatus {
    PENDING = "PENDING",
    CONTACTED = "CONTACTED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}
export declare enum EventType {
    PRIVATE = "PRIVATE",
    CORPORATE = "CORPORATE"
}
export declare class Booking {
    id: string;
    eventType: EventType;
    eventDate: Date;
    eventTime: string;
    locationUrl: string;
    description: string;
    status: BookingStatus;
    adminNotes: string;
    zone: Zone;
    zoneId: string;
    createdAt: Date;
    updatedAt: Date;
}
