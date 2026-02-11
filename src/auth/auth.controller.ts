import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Req() req: any) {
    return this.authService.login(
      body.email,
      body.password,
      req.ip,
      req.headers['user-agent'],
    );
  }
}
