import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async login(email: string, password: string, ip?: string, userAgent?: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      await this.auditService.log(null, 'LOGIN_FAILED', 'USUARIO', null, null, null, ip, userAgent);
      throw new UnauthorizedException('AUTH_INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new ForbiddenException('USER_INACTIVE');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      await this.auditService.log(user.id, 'LOGIN_FAILED', 'USUARIO', user.id, null, null, ip, userAgent);
      throw new UnauthorizedException('AUTH_INVALID_CREDENTIALS');
    }

    await this.usersService.updateLastLogin(user.id);

    await this.auditService.log(user.id, 'LOGIN_SUCCESS', 'USUARIO', user.id, null, null, ip, userAgent);

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
