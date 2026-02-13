"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const role_hierarchy_1 = require("../security/role-hierarchy");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
    }
    async updateLastLogin(id) {
        return this.prisma.user.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
    }
    async findAll(actorRole, includeInactive) {
        if (includeInactive && actorRole !== client_1.Role.DIRECCION) {
            throw new common_1.ForbiddenException('INSUFFICIENT_PERMISSIONS');
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
    async create(actorRole, actorId, data) {
        if (role_hierarchy_1.ROLE_HIERARCHY[data.role] >= role_hierarchy_1.ROLE_HIERARCHY[actorRole]) {
            throw new common_1.ForbiddenException('ROLE_ESCALATION_BLOCKED');
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
    async updateRole(actorRole, actorId, targetUserId, newRole, version) {
        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
        });
        if (!targetUser) {
            throw new common_1.NotFoundException('USER_NOT_FOUND');
        }
        if (!targetUser.isActive) {
            throw new common_1.ForbiddenException('USER_INACTIVE');
        }
        if (targetUser.version !== version) {
            throw new common_1.ConflictException('OPTIMISTIC_LOCK_ERROR');
        }
        if (actorId === targetUserId && newRole !== targetUser.role) {
            throw new common_1.ForbiddenException('SELF_ROLE_CHANGE_BLOCKED');
        }
        if (role_hierarchy_1.ROLE_HIERARCHY[actorRole] <= role_hierarchy_1.ROLE_HIERARCHY[targetUser.role]) {
            throw new common_1.ForbiddenException('ROLE_ESCALATION_BLOCKED');
        }
        if (role_hierarchy_1.ROLE_HIERARCHY[newRole] >= role_hierarchy_1.ROLE_HIERARCHY[actorRole]) {
            throw new common_1.ForbiddenException('ROLE_ESCALATION_BLOCKED');
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
    async softDelete(actorRole, actorId, targetUserId, version) {
        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
        });
        if (!targetUser) {
            throw new common_1.NotFoundException('USER_NOT_FOUND');
        }
        if (!targetUser.isActive) {
            throw new common_1.ForbiddenException('USER_ALREADY_INACTIVE');
        }
        if (actorId === targetUserId) {
            throw new common_1.ForbiddenException('SELF_DELETE_BLOCKED');
        }
        if (role_hierarchy_1.ROLE_HIERARCHY[actorRole] <= role_hierarchy_1.ROLE_HIERARCHY[targetUser.role]) {
            throw new common_1.ForbiddenException('ROLE_ESCALATION_BLOCKED');
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
            throw new common_1.ConflictException('OPTIMISTIC_LOCK_ERROR');
        }
        return { message: 'USER_DEACTIVATED' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map