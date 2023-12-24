import { RestfulResource } from "../restful.resource";
import urljoin from 'url-join';
import { APIClient } from "../client";

export class RoleEntity extends RestfulResource<API.Role> {
  static api_name = 'role';

  constructor(client: APIClient) {
    super(client, 'roles', 'v1');
  }

  async listPermissions(role_id: string, query: API.PageQuery): Promise<API.Page<API.Permission>> {
    const url = urljoin(this.client.basePath, this.version, this.resource, role_id, 'permissions');
    return await this.client.request(url, `read:roles`, {
      method: 'GET',
      params: query,
    });
  }

  async addPermissions(role_id: string, permissions: API.Permission[]): Promise<void> {  
    const data = {
      permissions,
    };

    const url = urljoin(this.client.basePath, this.version, this.resource, role_id, 'permissions');

    return await this.client.request(url, `update:roles`, {
      method: 'POST',
      data,
    });
  }

  async removePermissions(role_id: string, permissions: API.Permission[]): Promise<void> {  
    const data = {
      permissions,
    };

    const url = urljoin(this.client.basePath, this.version, this.resource, role_id, 'permissions');

    return await this.client.request(url, `update:roles`, {
      method: 'DELETE',
      data,
    });
  }

  async listUsers(role_id: string, query: API.PageQuery): Promise<API.Page<API.User>> {
    const url = urljoin(this.client.basePath, this.version, this.resource, role_id, 'users');
    return await this.client.request<API.Page<API.User>>(url, `read:roles`, {
      method: 'GET',
      params: query,
    });
  }

  async assignUsers(role_id: string, user_ids: string[]): Promise<void> {
    const url = urljoin(this.client.basePath, this.version, this.resource, role_id, 'users');
    return await this.client.request(url, `update:roles`, {
      method: 'POST',
      data: {
        users: user_ids,
      },
    });
  }

  async unassignUsers(role_id: string, user_ids: string[]): Promise<void> {
    const url = urljoin(this.client.basePath, this.version, this.resource, role_id, 'users');
    return await this.client.request(url, `update:roles`, {
      method: 'DELETE',
      data: {
        users: user_ids,
      },
    });
  }
}