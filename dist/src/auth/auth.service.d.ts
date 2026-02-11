import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private auditService;
    constructor(usersService: UsersService, jwtService: JwtService, auditService: AuditService);
    login(email: string, password: string, ip?: string, userAgent?: string): Promise<{
        access_token: string;
    }>;
}
