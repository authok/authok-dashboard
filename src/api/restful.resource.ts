import urljoin from 'url-join';
import { BaseEntity } from './base.entity';
import { APIClient } from './client';
import { IRestfulResource } from './resource';

export class RestfulResource<R> extends BaseEntity implements IRestfulResource<R> {
  protected version: string;
  protected resource: string;
  protected scopeName?: string;

  constructor(client: APIClient, resource: string, version: string, scopeName?: string) {
    super(client);

    this.version = version;
    this.resource = resource;
    this.scopeName = scopeName;
  }

  async get(id: string): Promise<R | undefined> {
    const scopeName = this.scopeName || this.resource;
    const url = urljoin(this.client.basePath, this.version, this.resource, id);
    return await this.client.request<R>(url, `read:${scopeName}`);
  }

  async create(data: Partial<R>): Promise<R> {
    const scopeName = this.scopeName || this.resource;
    const url = urljoin(this.client.basePath, this.version, this.resource);

    return await this.client.request<R>(url, `create:${scopeName}`, {
      method: 'POST',
      data,
    });
  }

  async update(id: string | number, data: Partial<R>): Promise<R> {
    const scopeName = this.scopeName || this.resource;
    const url = urljoin(this.client.basePath, this.version, this.resource, id);
    return await this.client.request<R>(url, `update:${scopeName}`, {
      method: 'PATCH',
      data,
    });
  }


  async delete(id: string): Promise<R> {
    const scopeName = this.scopeName || this.resource;
    const url = urljoin(this.client.basePath, this.version, this.resource, id);

    return await this.client.request<R>(url, `delete:${scopeName}`, {
      method: 'DELETE',
    });
  }

  async paginate(query: API.PageQuery): Promise<API.Page<R>> {
    const scopeName = this.scopeName || this.resource;
    const url = urljoin(this.client.basePath, this.version, this.resource);

    return await this.client.request<API.Page<R>>(url, `read:${scopeName}`, {
      method: 'GET',
      params: query,
    });
  }

  async cursor(query: API.CursorQuery): Promise<API.CursorResult<R>> {
    const scopeName = this.scopeName || this.resource;
    const url = urljoin(this.client.basePath, this.version, this.resource);

    return await this.client.request<API.CursorResult<R>>(url, `read:${scopeName}`, {
      method: 'GET',
      params: query,
    });
  }
}