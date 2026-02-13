import { UsersService } from './users.service';
import { Role } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: any, includeInactive?: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        version: number;
        createdAt: Date;
    }[]>;
    createUser(req: any, body: {
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
    updateUserRole(req: any, targetUserId: string, body: {
        role: Role;
        version: number;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        version: number;
        updatedAt: Date;
    }>;
    deactivateUser(req: any, targetUserId: string, body: {
        version: number;
    }): Promise<{
        message: string;
    }>;
}
