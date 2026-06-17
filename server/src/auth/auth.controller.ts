import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import type { AuthenticatedRequest } from './auth.guard';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  register(
    @Body()
    body: {
      email?: string;
      password?: string;
      name?: string;
      surname?: string;
      birthDate?: string | Date | null;
      gender?: string | null;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('auth/login')
  login(@Body() body: { email?: string; password?: string }) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Patch('me/profile')
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      name?: string;
      surname?: string | null;
      gender?: string | null;
      height?: number | string | null;
      weight?: number | string | null;
    },
  ) {
    return this.authService.updateProfile(request.user, body);
  }
}
