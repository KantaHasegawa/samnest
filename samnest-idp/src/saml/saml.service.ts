import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { resolve } from 'path';
import { SERVICE_PROVIDERS } from './saml.data';
import {
  ServiceProvider,
  IdentityProviderInstance,
  ServiceProviderInstance,
  setSchemaValidator,
} from 'samlify';
import * as validator from '@authenio/samlify-xsd-schema-validator';
import { User } from '../auth/auth.data';
import { CreateSAMLResponseDTO } from './saml.createResponse.dto';
import * as zlib from 'zlib';
import { XMLParser } from 'fast-xml-parser';
import { promisify } from 'util';
const fsps = fs.promises;
const parser = new XMLParser();
const psInflateRaw = promisify(zlib.inflateRaw);
setSchemaValidator(validator);

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
    return await this.idp.createLoginResponse(
      sp,
      null,
      'post',
      user,
      null,
      true,
    );
  }

  async getIssuerFromSAMLRequest(samlRequest: string) {
    const decoded = Buffer.from(samlRequest, 'base64');
    const decodedXmlBuffer = await psInflateRaw(decoded);
    const decodedXml = decodedXmlBuffer.toString();
    const ob = parser.parse(decodedXml);
    const issuer = ob['samlp:AuthnRequest']['saml:Issuer'];
    if (!issuer) {
      throw new Error('cant get issuer');
    }
    return issuer;
  }

  async getProviderByEntityID(entityID: string) {
    const spData = SERVICE_PROVIDERS.find((sp) => sp.entityID === entityID);
    const sp = await this.getServiceProvider(spData.id);
    if (!sp) {
      throw new Error('Service provider not found');
    }
    return sp;
  }

  async validateRequest(sp: ServiceProviderInstance, req: any) {
    const SAMLRequest = req.query.SAMLRequest;
    const Signature = req.query.Signature;
    const SigAlg = req.query.SigAlg;
    delete req.query.Signature;
    const octetString = Object.keys(req.query)
      .map((q) => q + '=' + encodeURIComponent(req.query[q] as string))
      .join('&');
    await this.idp.parseLoginRequest(sp, 'redirect', {
      query: { SAMLRequest, Signature, SigAlg },
      octetString: octetString,
    });
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
