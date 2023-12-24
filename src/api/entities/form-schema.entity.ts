import urljoin from 'url-join';
import { APIClient } from '../client';
import { IResource } from '../resource';

export class FormSchemaEntity implements IResource {
  static api_name = 'form-schema';

  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async get(namespace: stirng, name: string): Promise<Object> {
    const url = urljoin(this.client.basePath, 'v1', 'form-schemas', namespace, name);
    return await this.client.request(url, 'read:global_configs', {
      method: 'GET',
    });
  }
}