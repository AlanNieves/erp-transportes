import { PrismaService } from '../prisma/prisma.service';
import { AuditEntity } from '@prisma/client';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(usuarioId: string | null, accion: string, entidad: AuditEntity | string, entidadId: string | null, antes: any, despues: any, ip?: string, userAgent?: string): Promise<void>;
}
