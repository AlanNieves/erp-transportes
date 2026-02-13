import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { AuditEntity } from '@prisma/client';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Solo auditar operaciones que modifican estado
    if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const user = request.user;
    const params = request.params;

    // 🔒 Sanitizar body
    let sanitizedBody = request.body ? { ...request.body } : null;

    if (sanitizedBody?.password) {
      sanitizedBody.password = '***';
    }

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          let sanitizedResponse = responseData;

          // 🔒 Nunca guardar tokens en login
          if (request.url.includes('/auth/login')) {
            sanitizedResponse = null;
          }

          await this.auditService.log(
            user?.id ?? null,
            `${method}_${request.url}`,
            AuditEntity.USUARIO,
            params?.id ?? null,
            sanitizedBody ?? null,
            sanitizedResponse ?? null,
            request.ip,
            request.headers['user-agent'],
          );
        } catch (err) {
          console.error('Audit logging failed:', err);
        }
      }),
    );
  }
}
