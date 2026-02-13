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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const require_permission_decorator_1 = require("../common/decorators/require-permission.decorator");
const permissions_matrix_1 = require("../security/permissions.matrix");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(req, includeInactive) {
        const actorRole = req.user.role;
        return this.usersService.findAll(actorRole, includeInactive === 'true');
    }
    async createUser(req, body) {
        const actorRole = req.user.role;
        const actorId = req.user.id;
        return this.usersService.create(actorRole, actorId, body);
    }
    async updateUserRole(req, targetUserId, body) {
        const actorRole = req.user.role;
        const actorId = req.user.id;
        return this.usersService.updateRole(actorRole, actorId, targetUserId, body.role, body.version);
    }
    async deactivateUser(req, targetUserId, body) {
        const actorRole = req.user.role;
        const actorId = req.user.id;
        return this.usersService.softDelete(actorRole, actorId, targetUserId, body.version);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, require_permission_decorator_1.RequirePermission)(permissions_matrix_1.Permission.USER_READ),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, require_permission_decorator_1.RequirePermission)(permissions_matrix_1.Permission.USER_CREATE),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, require_permission_decorator_1.RequirePermission)(permissions_matrix_1.Permission.USER_ASSIGN_ROLE),
    (0, common_1.Patch)(':id/role'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserRole", null);
__decorate([
    (0, require_permission_decorator_1.RequirePermission)(permissions_matrix_1.Permission.USER_DELETE),
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivateUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map