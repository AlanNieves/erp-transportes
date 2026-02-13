import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { Permission } from '../security/permissions.matrix';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 📌 LISTAR USUARIOS (Hardening includeInactive)
  @RequirePermission(Permission.USER_READ)
  @Get()
  async findAll(
    @Req() req: any,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const actorRole: Role = req.user.role;

    return this.usersService.findAll(
      actorRole,
      includeInactive === 'true',
    );
  }

  // 📌 CREAR USUARIO
  @RequirePermission(Permission.USER_CREATE)
  @Post()
  async createUser(
    @Req() req: any,
    @Body()
    body: {
      email: string;
      name: string;
      password: string;
      role: Role;
    },
  ) {
    const actorRole: Role = req.user.role;
    const actorId: string = req.user.id;

    return this.usersService.create(actorRole, actorId, body);
  }

  // 📌 ACTUALIZAR ROL
  @RequirePermission(Permission.USER_ASSIGN_ROLE)
  @Patch(':id/role')
  async updateUserRole(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body()
    body: {
      role: Role;
      version: number;
    },
  ) {
    const actorRole: Role = req.user.role;
    const actorId: string = req.user.id;

    return this.usersService.updateRole(
      actorRole,
      actorId,
      targetUserId,
      body.role,
      body.version,
    );
  }

  // 📌 SOFT DELETE
  @RequirePermission(Permission.USER_DELETE)
  @Patch(':id/deactivate')
  async deactivateUser(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body() body: { version: number },
  ) {
    const actorRole: Role = req.user.role;
    const actorId: string = req.user.id;

    return this.usersService.softDelete(
      actorRole,
      actorId,
      targetUserId,
      body.version,
    );
  }
}
