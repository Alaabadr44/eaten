import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminsService } from '../admins/admins.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminsService = app.get(AdminsService);

  const email = 'admin@eaten.com';
  const password = 'admin';
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await adminsService.findOne(email);
  if (existing) {
    console.log('Admin already exists');
  } else {
    // Service now accepts DTO and hashes password internally
    await adminsService.create({ email, password });
    console.log(`Admin created: ${email} / ${password}`);
  }

  await app.close();
}
bootstrap();
