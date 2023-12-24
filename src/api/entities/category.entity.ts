import urljoin from 'url-join';
import { APIClient } from '../client';
import { IResource } from '../resource';

export class CategoryEntity implements IResource {
  static api_name = 'category';

  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async paginate(query: API.PageQuery): Promise<API.Page<API.Category>> {
    const url = urljoin(this.client.basePath, 'v1', 'marketplace', 'categories');
    return await this.client.request(url, ``, {
      method: 'GET',
      params: query,
    });
  }

  async get(category_id: string): Promise<API.Category | undefined> {
    const url = urljoin(this.client.basePath, 'v1', 'marketplace', 'categories', category_id);
    return await this.client.request(url, ``, {
      method: 'GET',
    });
  }
}