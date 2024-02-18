import { Module } from '@nestjs/common';
import { SamlService } from './saml.service';
import { SamlController } from './saml.controller';
import { SamlStrategy } from './saml.strategy';

@Module({
  providers: [SamlService, SamlStrategy],
  controllers: [SamlController],
})
export class SamlModule {}
