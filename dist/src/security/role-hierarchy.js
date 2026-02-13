"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_HIERARCHY = void 0;
exports.canAssignRole = canAssignRole;
exports.ROLE_HIERARCHY = {
    OPERATIVO: 1,
    ADMINISTRATIVO: 2,
    DIRECCION: 3,
};
function canAssignRole(actorRole, targetRole) {
    return exports.ROLE_HIERARCHY[actorRole] > exports.ROLE_HIERARCHY[targetRole];
}
//# sourceMappingURL=role-hierarchy.js.map