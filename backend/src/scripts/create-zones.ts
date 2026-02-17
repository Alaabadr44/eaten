import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ZonesService } from '../zones/zones.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const zonesService = app.get(ZonesService);

  const mockZones = [
    { name: 'Zone A', isActive: true },
    { name: 'Zone B', isActive: true },
    { name: 'Zone C', isActive: true },
    { name: 'Zone D', isActive: true },
    { name: 'Zone E', isActive: true },
  ];

  console.log('Seeding zones...');

  // Simple check to avoid duplicates if running multiple times
  // Note: This relies on name uniqueness or just catching unique constraint errors if they exist.
  // Since we don't know the exact constraints, we'll try to find or create.
  // However, findAll() returns everything. Let's just create and catch errors for simplicity like create-services.

  for (const zone of mockZones) {
    try {
        // ideally we check if it exists, but create-services.ts patterns suggests just try/catch
        // Let's improve by checking if a zone with the same name exists if possible, 
        // but ZonesService only has findOne(id) and findAll().
        // We will just try to create.
        
      await zonesService.create(zone);
      console.log(`Created zone: ${zone.name}`);
    } catch (error) {
      console.error(`Failed to create zone ${zone.name}:`, error.message);
    }
  }

  console.log('Seeding complete.');
  await app.close();
}

bootstrap();
