import { Permission } from '../../security/permissions.matrix';
export declare const PERMISSION_KEY = "permission";
export declare const RequirePermission: (permission: Permission) => import("@nestjs/common").CustomDecorator<string>;
