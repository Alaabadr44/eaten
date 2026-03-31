"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const services_service_1 = require("../services/services.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const servicesService = app.get(services_service_1.ServicesService);
    const mockServices = [
        {
            name: 'Catering Premium',
            category: 'Food',
            description: 'Full catering service with premium menu options.',
        },
        {
            name: 'Standard Cleaning',
            category: 'Maintenance',
            description: 'Basic post-event cleaning service.',
        },
        {
            name: 'Event Security',
            category: 'Safety',
            description: 'Professional security personnel for events.',
        },
        {
            name: 'Floral Decoration',
            category: 'Setup',
            description: 'Custom floral arrangements and venue styling.',
        },
        {
            name: 'DJ & Sound System',
            category: 'Entertainment',
            description: 'Professional DJ with high-quality sound equipment.',
        },
    ];
    console.log('Seeding services...');
    for (const service of mockServices) {
        try {
            await servicesService.create(service);
            console.log(`Created service: ${service.name}`);
        }
        catch (error) {
            console.error(`Failed to create service ${service.name}:`, error.message);
        }
    }
    console.log('Seeding complete.');
    await app.close();
}
bootstrap();
//# sourceMappingURL=create-services.js.map