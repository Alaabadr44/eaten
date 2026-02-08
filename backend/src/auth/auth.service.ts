import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, pass: string): Promise<Omit<Admin, 'passwordHash'> | null> {
    const admin = await this.adminsService.findOne(email);
    if (admin && (await bcrypt.compare(pass, admin.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(admin: Omit<Admin, 'passwordHash'>) {
    const payload = { email: admin.email, sub: admin.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
