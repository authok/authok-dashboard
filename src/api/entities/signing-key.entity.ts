import urljoin from 'url-join';
import { RestfulResource } from "../restful.resource";
import { APIClient } from '../client';

export class SigningKeyEntity extends RestfulResource<API.SigningKey> {
  static api_name = 'key';

  constructor(client: APIClient) {
    super(client, 'keys', 'v1');
  }

  async list(): Promise<API.SigningKey[]> {
    const url = urljoin(this.client.basePath, 'v1', 'keys', 'signing');
    return await this.client.request(url, `read:signing_keys`, {
      method: 'GET',
    });
  }

  async rotate(): Promise<API.SigningKey> {
    const url = urljoin(this.client.basePath, 'v1', 'keys', 'rotate');
    return await this.client.request(url, `create:signing_keys update:signing_keys`, {
      method: 'POST',
    });
  }
}