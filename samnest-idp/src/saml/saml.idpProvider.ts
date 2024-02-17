import * as fs from 'fs';
import { resolve } from 'path';
import { IdentityProvider, IdentityProviderInstance } from 'samlify';
const fsps = fs.promises;

export const SamlIDPProviderFactory = {
  provide: 'SAML_IDP',
  useFactory: async (): Promise<IdentityProviderInstance> => {
    const [privateKey, encPrivateKey, metadata] = await Promise.all([
      fsps.readFile(resolve(__dirname, '../../keys/private_key.pem')),
      fsps.readFile(resolve(__dirname, '../../keys/private_key.pem')),
      fsps.readFile(resolve(__dirname, '../../metadata/idpmetadata.xml')),
    ]);
    const baseIDPConfig = {
      isAssertionEncrypted: true,
      privateKey: privateKey,
      encPrivateKey: encPrivateKey,
      metadata: metadata,
    };
    return IdentityProvider(baseIDPConfig);
  },
};
