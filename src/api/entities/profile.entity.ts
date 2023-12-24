import urljoin from 'url-join';
import { RestfulResource } from "../restful.resource";
import { APIClient } from '../client';

export class ProfileEntity extends RestfulResource<API.User> {
  static api_name = 'profile';

  constructor(client: APIClient) {
    super(client, 'profile', 'v1');
  }

  async userinfo(): Promise<API.User> {
    const url = urljoin(this.client.basePath, 'v1', 'profile')    
    return await this.client.request(url, '', {
      method: 'GET',
    });
  }
}