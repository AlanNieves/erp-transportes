import { Role } from '@prisma/client';

export enum Permission {
  // USER
  USER_READ = 'USER_READ',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_ASSIGN_ROLE = 'USER_ASSIGN_ROLE',

  // AUDIT
  AUDIT_READ = 'AUDIT_READ',
}

/**
 * MAPEO ROL → PERMISOS
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  DIRECCION: [
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_ASSIGN_ROLE,
    Permission.AUDIT_READ,
  ],

  ADMINISTRATIVO: [
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
  ],

  OPERATIVO: [
    
  ],
};

/**
 * Helper central para validar permisos
 */
export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
