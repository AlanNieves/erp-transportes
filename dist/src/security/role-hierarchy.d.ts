import { Role } from '@prisma/client';
export declare const ROLE_HIERARCHY: Record<Role, number>;
export declare function canAssignRole(actorRole: Role, targetRole: Role): boolean;
