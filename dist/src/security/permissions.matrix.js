"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.Permission = void 0;
exports.can = can;
var Permission;
(function (Permission) {
    Permission["USER_READ"] = "USER_READ";
    Permission["USER_CREATE"] = "USER_CREATE";
    Permission["USER_UPDATE"] = "USER_UPDATE";
    Permission["USER_DELETE"] = "USER_DELETE";
    Permission["USER_ASSIGN_ROLE"] = "USER_ASSIGN_ROLE";
    Permission["AUDIT_READ"] = "AUDIT_READ";
})(Permission || (exports.Permission = Permission = {}));
exports.ROLE_PERMISSIONS = {
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
    OPERATIVO: [],
};
function can(role, permission) {
    return exports.ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
//# sourceMappingURL=permissions.matrix.js.map