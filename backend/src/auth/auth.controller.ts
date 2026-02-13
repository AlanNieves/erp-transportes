import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
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
