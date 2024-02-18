import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-saml';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { USERS } from './saml.data';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      issuer: 'http://localhost:3001/saml/metadata.xml',
      callbackUrl: 'http://localhost:3001/saml/samnest-idp/acs',
      cert: 'MIIDazCCAlOgAwIBAgIUJUQp9ggpoNtAVHN5wCCQ1pi1tWIwDQYJKoZIhvcNAQELBQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yNDAyMTYxNDA2MzJaFw0yNTAyMTUxNDA2MzJaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDgd8gTxvnvzgFFss18od6hSS20qvz0ja/M012XMT7NitASnuj9ARIdlB6uLBOBLtE34U1jgEzy5QGXWyeYn28GepULF4hO3Dq8tgP7bFIG42BhvJ5t9zC0fCUyOK6BnW+n1pyy13HJ27DE7uA5e2teVYGO9DFr27nZOlSHmEsDSNSNJvrwbhhV60RBcYIELADGSdfPGm7tDTJfvUBjrc/zHAFySI78KqUyli8lNnD+goXCZWLkaaILm6UelB1KShCItWlZZph+V8aSoO5fX+laoBeV9bSurCimr33sieXbiVbS81CWTSOC4UtFyabYX6M8hO58kGOldjV2SuKI4WOpAgMBAAGjUzBRMB0GA1UdDgQWBBQjh3PXdjgnG9dQzMaNVT4MA5L/MDAfBgNVHSMEGDAWgBQjh3PXdjgnG9dQzMaNVT4MA5L/MDAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBZPpHqT1k70CIk9AofPQqbqsPZ01MHRJo+W5xopZ+s7+NrRTE79xtSWvxQMKz0P2lOGrkbNjrisAHmduwA1SfmTjIvFApDL4HuIpduy3pkMi8Kup3b0tGpyFn7wLh/zKFXUV6sxIQlv2tz5JfE4tk9tYXxsaFetH8e2lKirxpsTvzQuYLOV6C3pG5bpxLOYmkJRnPFZKW4pIY3Z8+M9IXaDj1wjfnjkPBDnn79O5Wlyq/c4zPSWfUfwP5nayKT9zq1W9W9BuZZuRzb1wOYpGWC5lDw46icVNqIWAb7evOt1a9K4GVDzk1akWhvGgU9skNweFfiszJfWFIoiW49wKnR',
      entryPoint: 'http://localhost:3000/saml/redirect',
      privateKey: readFileSync(
        resolve(__dirname, '../../keys/sp_signing_private_key.pem'),
        'utf-8',
      ),
      decryptionPvk: readFileSync(
        resolve(__dirname, '../../keys/sp_encryption_private_key.pem'),
        'utf-8',
      ),
    });
  }

  async validate(profile: Profile) {
    try {
      const user = USERS.find((u) => {
        return u.email === profile.nameID;
      });
      return user;
    } catch (e) {
      throw new ForbiddenException('invalid user attributes');
    }
  }
}
