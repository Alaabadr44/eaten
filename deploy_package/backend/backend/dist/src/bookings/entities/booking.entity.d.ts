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
export declare enum EventCapacity {
    LESS_THAN_5 = "LESS_THAN_5",
    BETWEEN_5_AND_20 = "BETWEEN_5_AND_20",
    MORE_THAN_20 = "MORE_THAN_20"
}
export declare class Booking {
    id: string;
    orderReference: string;
    eventType: EventType;
    eventCapacity: EventCapacity;
    name: string;
    phone: string;
    eventDate: Date;
    eventTime: string;
    locationUrl: string;
    description: string;
    status: BookingStatus;
    cancellationReason: string;
    adminNotes: string;
    zone: Zone;
    zoneId: number;
    createdAt: Date;
    updatedAt: Date;
}
