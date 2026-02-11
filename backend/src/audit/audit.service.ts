import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditEntity } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(
    usuarioId: string | null,
    accion: string,
    entidad: AuditEntity | string,
    entidadId: string | null,
    antes: any,
    despues: any,
    ip?: string,
    userAgent?: string,
  ) {
    await this.prisma.auditLog.create({
      data: {
        usuarioId,
        accion,
        entidad: entidad as any,
        entidadId,
        antes,
        despues,
        ip,
        userAgent,
      },
    });
  }
}
