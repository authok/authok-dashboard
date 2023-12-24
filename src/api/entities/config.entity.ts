import urljoin from 'url-join';
import { APIClient } from "../restful.resource";
import { BaseEntity } from '../base.entity';

export class ConfigEntity extends BaseEntity {
  static api_name = 'config';

  constructor(client: APIClient) {
    super(client);
  }

  async get(namespace: string, name: string): Promise<API.Config> {
    const url = urljoin(this.client.basePath, 'v1', 'configs', namespace , name);
    
    return await this.client.request(url, `read:configs`, {
      method: 'GET',
    });
  }

  async set(namespace: string, name: string, data: Partial<API.Config>): Promise<API.Config> {
    const url = urljoin(this.client.basePath, 'v1', 'configs', namespace , name);

    return await this.client.request(url, `update:configs`, {
      method: 'PATCH',
      data,
    });
  }

  async list(query: API.PageQuery): Promise<API.Page<API.Config>> {
    const url = urljoin(this.client.basePath, 'v1', 'configs');

    return await this.client.request(url, `read:configs`, {
      method: 'GET',
      params: query,
    });
  }
}