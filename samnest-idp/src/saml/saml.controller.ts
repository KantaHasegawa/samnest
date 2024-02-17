import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SamlService } from './saml.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/auth.data';
import { CreateSAMLResponseDTO } from './saml.createResponse.dto';

@Controller('saml')
export class SamlController {
  constructor(private samlService: SamlService) {}

  @UseGuards(new AuthGuard())
  @Get('/service-providers')
  getServiceProviders() {
    return this.samlService.getServiceProviders();
  }

  @Post('/create-saml-response')
  async login(@Body() dto: CreateSAMLResponseDTO, @Request() req: any) {
    const user = req.user as User;
    const result = await this.samlService.createResponse(dto, user);
    return {
      result,
    };
  }
}
