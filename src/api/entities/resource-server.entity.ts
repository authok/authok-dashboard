import urljoin from 'url-join';
import { RestfulResource } from "../restful.resource";
import { APIClient } from '../client';

export class ResourceServerEntity extends RestfulResource<API.ResourceServer> {
  static api_name = 'resource-server';

  constructor(client: APIClient) {
    super(client, 'resource-servers', 'v1', 'resource_servers');
  }

  async fetchToken(req: API.TokenRequest): Promise<API.AccessTokenResult> {
    const url = urljoin(this.client.basePath, 'v1', this.resource, 'token')

    return await this.client.request(url, `read:resource_servers`, {
      method: 'POST',
      data: req,
    }); 
  }
}