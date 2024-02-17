export interface ServiceProviderData {
  id: number;
  name: string;
  entityID: string;
  metadata: string;
}

export const SERVICE_PROVIDERS: ServiceProviderData[] = [
  {
    id: 1,
    name: 'Service Provider 1',
    entityID: 'http://localhost:3000/saml/metadata.xml',
    metadata: 'sp-1metadata.xml',
  },
];
