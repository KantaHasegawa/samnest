import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
} from '@nestjs/common';
import { SamlAuthGuard } from './saml.gurad';
import { Response as ExpressResponse } from 'express';
import { TOKENS } from './saml.data';

@Controller('saml')
export class SamlController {
  @Get('samnest-idp/acs/login')
  @UseGuards(SamlAuthGuard)
  async samlLogin() {
    return;
  }

  @UseGuards(SamlAuthGuard)
  @Post('samnest-idp/acs')
  acs(@Request() req, @Response() res: ExpressResponse) {
    // NOTE: 本来ならRedis等に保存しているtokenを取得する
    const token = TOKENS.find((t) => t.id === req.user.id).token;
    // NOTE: 本来ならCookieでやりとりする
    res.redirect(`http://localhost:5174?token=${token}`);
  }
}
