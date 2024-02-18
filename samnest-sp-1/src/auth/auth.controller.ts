import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthBearerGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthBearerGuard)
  @Get('current')
  current(@Request() req) {
    return req.user;
  }
}
