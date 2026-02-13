"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("./audit.service");
const client_1 = require("@prisma/client");
let AuditInterceptor = class AuditInterceptor {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
            return next.handle();
        }
        const user = request.user;
        const params = request.params;
        let sanitizedBody = request.body ? { ...request.body } : null;
        if (sanitizedBody?.password) {
            sanitizedBody.password = '***';
        }
        return next.handle().pipe((0, operators_1.tap)(async (responseData) => {
            try {
                let sanitizedResponse = responseData;
                if (request.url.includes('/auth/login')) {
                    sanitizedResponse = null;
                }
                await this.auditService.log(user?.id ?? null, `${method}_${request.url}`, client_1.AuditEntity.USUARIO, params?.id ?? null, sanitizedBody ?? null, sanitizedResponse ?? null, request.ip, request.headers['user-agent']);
            }
            catch (err) {
                console.error('Audit logging failed:', err);
            }
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map