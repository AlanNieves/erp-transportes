import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        username: string | null;
        name: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLoginAt: Date | null;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateLastLogin(id: string): Promise<{
        id: string;
        email: string;
        username: string | null;
        name: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        lastLoginAt: Date | null;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(actorRole: Role, includeInactive: boolean): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        version: number;
        createdAt: Date;
    }[]>;
    create(actorRole: Role, actorId: string, data: {
        email: string;
        name: string;
        password: string;
        role: Role;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        version: number;
        createdAt: Date;
    }>;
    updateRole(actorRole: Role, actorId: string, targetUserId: string, newRole: Role, version: number): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        version: number;
        updatedAt: Date;
    }>;
    softDelete(actorRole: Role, actorId: string, targetUserId: string, version: number): Promise<{
        message: string;
    }>;
}
