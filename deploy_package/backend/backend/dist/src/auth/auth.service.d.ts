import { JwtService } from '@nestjs/jwt';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';
export declare class AuthService {
    private adminsService;
    private jwtService;
    constructor(adminsService: AdminsService, jwtService: JwtService);
    validateAdmin(email: string, pass: string): Promise<Omit<Admin, 'passwordHash'> | null>;
    login(admin: Omit<Admin, 'passwordHash'>): Promise<{
        access_token: string;
    }>;
}
