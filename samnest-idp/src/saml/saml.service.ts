import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { resolve } from 'path';
import { SERVICE_PROVIDERS } from './saml.data';
import {
  ServiceProvider,
  IdentityProviderInstance,
  ServiceProviderInstance,
} from 'samlify';
import { User } from '../auth/auth.data';
import { CreateSAMLResponseDTO } from './saml.createResponse.dto';
const fsps = fs.promises;

@Injectable()
export class SamlService {
  constructor(@Inject('SAML_IDP') private idp: IdentityProviderInstance) {}

  getServiceProviders() {
    return SERVICE_PROVIDERS.map((sp) => {
      return {
        id: sp.id,
        name: sp.name,
        entityID: sp.entityID,
      };
    });
  }

  async createResponse(dto: CreateSAMLResponseDTO, user: User) {
    const sp = await this.getServiceProvider(dto.id);
    return await this.idp.createLoginResponse(sp, null, 'post', user);
  }

  private async getServiceProvider(
    id: number,
  ): Promise<ServiceProviderInstance> {
    const spData = SERVICE_PROVIDERS.find((sp) => sp.id === id);
    if (!spData) {
      throw new Error('Service provider not found');
    }
    return ServiceProvider({
      metadata: await fsps.readFile(
        resolve(__dirname, `../../metadata/${spData.metadata}`),
      ),
    });
  }
}
