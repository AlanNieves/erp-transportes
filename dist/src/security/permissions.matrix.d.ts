import { Role } from '@prisma/client';
export declare enum Permission {
    USER_READ = "USER_READ",
    USER_CREATE = "USER_CREATE",
    USER_UPDATE = "USER_UPDATE",
    USER_DELETE = "USER_DELETE",
    USER_ASSIGN_ROLE = "USER_ASSIGN_ROLE",
    AUDIT_READ = "AUDIT_READ"
}
export declare const ROLE_PERMISSIONS: Record<Role, Permission[]>;
export declare function can(role: Role, permission: Permission): boolean;
