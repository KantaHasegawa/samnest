import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SamlModule } from './saml/saml.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SamlModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
