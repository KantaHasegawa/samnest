import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthBearerStrategy } from './auth.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthBearerStrategy],
})
export class AuthModule {}
