import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ROLE_HIERARCHY } from '../security/role-hierarchy';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  // 🔍 LISTAR (Hardening includeInactive)
  async findAll(actorRole: Role, includeInactive: boolean) {
    if (includeInactive && actorRole !== Role.DIRECCION) {
      throw new ForbiddenException('INSUFFICIENT_PERMISSIONS');
    }

    return this.prisma.user.findMany({
      where: includeInactive ? {} : { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        version: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  // 🔐 CREATE USER
  async create(
    actorRole: Role,
    actorId: string,
    data: {
      email: string;
      name: string;
      password: string;
      role: Role;
    },
  ) {
    if (ROLE_HIERARCHY[data.role] >= ROLE_HIERARCHY[actorRole]) {
      throw new ForbiddenException('ROLE_ESCALATION_BLOCKED');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        name: data.name,
        passwordHash,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        version: true,
        createdAt: true,
      },
    });
  }

  // 🔐 UPDATE ROLE
  async updateRole(
    actorRole: Role,
    actorId: string,
    targetUserId: string,
    newRole: Role,
    version: number,
  ) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    if (!targetUser.isActive) {
      throw new ForbiddenException('USER_INACTIVE');
    }

    if (targetUser.version !== version) {
      throw new ConflictException('OPTIMISTIC_LOCK_ERROR');
    }

    if (actorId === targetUserId && newRole !== targetUser.role) {
      throw new ForbiddenException('SELF_ROLE_CHANGE_BLOCKED');
    }

    if (ROLE_HIERARCHY[actorRole] <= ROLE_HIERARCHY[targetUser.role]) {
      throw new ForbiddenException('ROLE_ESCALATION_BLOCKED');
    }

    if (ROLE_HIERARCHY[newRole] >= ROLE_HIERARCHY[actorRole]) {
      throw new ForbiddenException('ROLE_ESCALATION_BLOCKED');
    }

    return this.prisma.user.update({
      where: { id: targetUserId, version },
      data: {
        role: newRole,
        version: { increment: 1 },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        version: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  // 🗑 SOFT DELETE
  async softDelete(
    actorRole: Role,
    actorId: string,
    targetUserId: string,
    version: number,
  ) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    if (!targetUser.isActive) {
      throw new ForbiddenException('USER_ALREADY_INACTIVE');
    }

    if (actorId === targetUserId) {
      throw new ForbiddenException('SELF_DELETE_BLOCKED');
    }

    if (ROLE_HIERARCHY[actorRole] <= ROLE_HIERARCHY[targetUser.role]) {
      throw new ForbiddenException('ROLE_ESCALATION_BLOCKED');
    }

    const updated = await this.prisma.user.updateMany({
      where: {
        id: targetUserId,
        version,
      },
      data: {
        isActive: false,
        version: { increment: 1 },
      },
    });

    if (updated.count === 0) {
      throw new ConflictException('OPTIMISTIC_LOCK_ERROR');
    }

    return { message: 'USER_DEACTIVATED' };
  }
}
