import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
export declare class AdminsService {
    private adminsRepository;
    constructor(adminsRepository: Repository<Admin>);
    findOne(email: string): Promise<Admin | null>;
    create(email: string, passwordHash: string): Promise<Admin>;
}
