import urljoin from 'url-join';
import { APIClient } from '../client';
import { IResource } from '../resource';

export class FeatureEntity implements IResource {
  static api_name = 'feature';

  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async paginate(query: API.PageQuery): Promise<API.Page<API.Feature>> {
    const url = urljoin(this.client.basePath, 'v1', 'marketplace', 'features');
    return await this.client.request(url, ``, {
      method: 'GET',
      params: query,
    });
  }

  async findCatalog(feature_slug: string, catalog_id: string): Promise<API.Catalog | undefined> {
    const url = urljoin(this.client.basePath, 'v1', 'marketplace', 'features', feature_slug, catalog_id);
    return await this.client.request(url, ``, {
      method: 'GET',
    });
  }

  async listCatalogs(feature_slug: string, query: API.PageQuery): Promise<API.Page<API.Catalog>> {
    const url = urljoin(this.client.basePath, 'v1', 'marketplace', 'features', feature_slug);
    return await this.client.request(url, ``, {
      method: 'GET',
      params: query,
    });
  }
}