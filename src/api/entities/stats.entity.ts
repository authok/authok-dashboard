import { APIClient } from '../client';
import urljoin from 'url-join';
import { BaseEntity } from "../base.entity";

export class StatsEntity extends BaseEntity {
  static api_name = 'stats';

  constructor(client: APIClient) {
    super(client);
  }

  async fetch(key: string, filter: Record<string, any>): Promise<API.MetricDto[]> {
    const url = urljoin(this.client.basePath, 'v1', 'stats', key);
    return await this.client.request(url, '', {
      method: 'GET',
      params: filter,
    });
  }
}