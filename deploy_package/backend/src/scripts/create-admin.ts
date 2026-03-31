import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminsService } from '../admins/admins.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminsService = app.get(AdminsService);

  const email = 'admin@eaten.com';
  const password = 'admin';
  
  // Check if an admin with THIS email exists
  const existing = await adminsService.findOne(email);
  if (existing) {
    console.log(`Admin ${email} already exists.`);
  } else {
    // If not, maybe there's an old admin with a different email?
    // For this project, we'll just create the new one.
    await adminsService.create({ email, password });
    console.log(`Admin created: ${email} / ${password}`);
  }

  await app.close();
}
bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
