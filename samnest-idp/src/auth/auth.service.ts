import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './auth.login.dto';
import { AUTH_TOKENS, USERS } from './auth.data';

@Injectable()
export class AuthService {
  login(dto: LoginDto) {
    const user = USERS.find(
      (u) => u.email === dto.email && u.password === dto.password,
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const token = AUTH_TOKENS.find((t) => t.id === user.id);
    if (!token) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    return {
      user: user,
      token: token.token,
    };
  }
}
