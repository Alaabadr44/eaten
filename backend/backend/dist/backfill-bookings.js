"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./src/bookings/entities/booking.entity");
const zone_entity_1 = require("./src/zones/entities/zone.entity");
const nanoid_1 = require("nanoid");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'catering_db',
    entities: [booking_entity_1.Booking, zone_entity_1.Zone],
});
async function migrate() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(booking_entity_1.Booking);
    const bookings = await repo.find();
    console.log(`Found ${bookings.length} total bookings.`);
    const nullRefs = bookings.filter((b) => !b.orderReference);
    console.log(`Found ${nullRefs.length} bookings with null orderReference.`);
    const nanoid = (0, nanoid_1.customAlphabet)('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
    for (const booking of bookings) {
        if (!booking.orderReference) {
            booking.orderReference = `BK-${nanoid()}`;
            await repo.save(booking);
            console.log(`Updated booking ${booking.id} with ref ${booking.orderReference}`);
        }
    }
    await AppDataSource.destroy();
}
migrate().catch(console.error);
//# sourceMappingURL=backfill-bookings.js.map