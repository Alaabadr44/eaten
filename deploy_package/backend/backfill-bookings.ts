import { DataSource } from 'typeorm';
import { Booking } from './src/bookings/entities/booking.entity';
import { Zone } from './src/zones/entities/zone.entity';
import { customAlphabet } from 'nanoid';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'catering_db',
  entities: [Booking, Zone],
});

async function migrate() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Booking);
  const bookings = await repo.find();
  console.log(`Found ${bookings.length} total bookings.`);

  const nullRefs = bookings.filter((b) => !b.orderReference);
  console.log(`Found ${nullRefs.length} bookings with null orderReference.`);

  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

  for (const booking of bookings) {
    if (!booking.orderReference) {
      booking.orderReference = `BK-${nanoid()}`;
      await repo.save(booking);
      console.log(
        `Updated booking ${booking.id} with ref ${booking.orderReference}`,
      );
    }
  }

  await AppDataSource.destroy();
}

migrate().catch(console.error);
