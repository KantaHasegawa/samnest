import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AUTH_TOKENS, USERS } from './auth.data';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let headerToken = request.headers.authorization;
    if (!headerToken) {
      return false;
    }
    headerToken = headerToken.replace('Bearer ', '');
    const token = AUTH_TOKENS.find((t) => t.token === headerToken);
    if (!token) {
      return false;
    }
    const user = USERS.find((u) => u.id === token.id);
    if (!user) {
      return false;
    }
    request.user = user;

    return true;
  }
}
