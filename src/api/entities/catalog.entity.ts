import urljoin from 'url-join';
import { APIClient } from '../client';
import { IResource } from '../resource';

export class CatalogEntity implements IResource {
  static api_name = 'catalog';

  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async paginate(query: API.PageQuery): Promise<API.Page<API.Catalog>> {
    const url = urljoin(this.client.basePath, 'v1', 'marketplace', 'catalogs');
    return await this.client.request(url, ``, {
      method: 'GET',
      params: query,
    });
  }

  async search(query: API.PageQuery): Promise<API.Page<API.Catalog>> {
    const url = urljoin(this.client.basePath, 'v1', 'marketplace', 'catalogs');
    return await this.client.request(url, ``, {
      method: 'GET',
      params: query,
    });
  }

  async findBySlug(slug: string): Promise<API.Catalog | undefined> {
    const url = urljoin(this.client.basePath, 'v1', 'marketplace', 'catalogs', 'by-slug', slug);
    return await this.client.request(url, ``, {
      method: 'GET',
    });
  }
}