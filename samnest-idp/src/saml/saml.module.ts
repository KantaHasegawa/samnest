import { Module } from '@nestjs/common';
import { SamlController } from './saml.controller';
import { SamlService } from './saml.service';
import { SamlIDPProviderFactory } from './saml.idpProvider';

@Module({
  controllers: [SamlController],
  providers: [SamlService, SamlIDPProviderFactory],
})
export class SamlModule {}
