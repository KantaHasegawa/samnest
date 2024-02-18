import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { SamlService } from './saml.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/auth.data';
import { CreateSAMLResponseDTO } from './saml.createResponse.dto';
import { SERVICE_PROVIDERS } from './saml.data';

@Controller('saml')
export class SamlController {
  constructor(private samlService: SamlService) {}

  @UseGuards(new AuthGuard())
  @Get('/service-providers')
  getServiceProviders() {
    return this.samlService.getServiceProviders();
  }

  @UseGuards(new AuthGuard())
  @Post('/create-saml-response')
  async login(@Body() dto: CreateSAMLResponseDTO, @Request() req: any) {
    const user = req.user as User;
    const result = await this.samlService.createResponse(dto, user);
    return {
      result,
    };
  }

  @Get('/redirect')
  async samlRedirectBinding(@Request() req: any, @Response() res: any) {
    const entityID = await this.samlService.getIssuerFromSAMLRequest(
      req.query.SAMLRequest,
    );
    const sp = await this.samlService.getProviderByEntityID(entityID);
    await this.samlService.validateRequest(sp, req);
    const spID = SERVICE_PROVIDERS.find((sp) => sp.entityID === entityID).id;
    res.redirect(`http://localhost:5173/sp-initicated-login?id=${spID}`);
  }
}
