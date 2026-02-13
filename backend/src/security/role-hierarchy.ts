import { Role } from '@prisma/client';

/**
 * Jerarquía interna del sistema
 * Mayor número = mayor poder
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  OPERATIVO: 1,
  ADMINISTRATIVO: 2,
  DIRECCION: 3,
};

/**
 * Permite saber si un rol puede asignar otro rol.
 * Regla:
 * - Solo puede asignar roles de menor nivel
 * - No puede asignar su mismo nivel
 * - No puede auto-escalar
 */
export function canAssignRole(
  actorRole: Role,
  targetRole: Role,
): boolean {
  return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole];
}
