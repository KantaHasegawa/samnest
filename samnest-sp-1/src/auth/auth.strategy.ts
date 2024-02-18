import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TOKENS, USERS } from '../saml/saml.data';

@Injectable()
export class AuthBearerStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    const getToken = TOKENS.find((t) => t.token === token);
    if (!getToken) {
      throw new UnauthorizedException();
    }
    const userID = getToken.id;
    const user = USERS.find((u) => u.id === userID);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
