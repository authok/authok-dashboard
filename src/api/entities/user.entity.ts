import urljoin from 'url-join';
import { RestfulResource } from "../restful.resource";
import { APIClient } from '../client';

export class UserEntity extends RestfulResource<API.User> {
  static api_name = 'user';

  constructor(client: APIClient) {
    super(client, 'users', 'v1');
  }

  async batchDelete(ids: string[]): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'users', 'batch');

    return await this.client.request(url, `delete:users`, {
      method: 'DELETE',
      data: ids,
    });
  }

  async linkIdentity(primary_user_id: string, linkReq: API.LinkIdentityReq): Promise<API.Identity[]> {
    const url = urljoin(this.client.basePath, 'v1', 'users', primary_user_id, 'identities');

    return await this.client.request(url, `update:users`, {
      method: 'POST',
      data: linkReq,
    });
  }

  async unlinkIdentity(primaryUserId: string, connection: string, secondaryUserId: string): Promise<API.Identity[]> {
    const url = urljoin(this.client.basePath, 'v1', 'users', primaryUserId, 'identities', connection, secondaryUserId);

    return await this.client.request<API.Identity[]>(url, `update:users`, {
      method: 'DELETE',
    });
  }

  async listLogEvents(user_id: string, query: API.CursorQuery): Promise<API.CursorResult<API.Log>> {  
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'logs');

    return await this.client.request(url, `read:users`, {
      method: 'GET',
      params: query,
    });
  }

  async listPermissions(user_id: string, query: API.PageQuery): Promise<API.Page<API.Permission>> {
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'permissions');

    return await this.client.request(url, `read:users`, {
      method: 'GET',
      params: query,
    });
  }

  async addPermissions(user_id: string, permissions: Partial<API.Permission>): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'permissions');
  
    return await this.client.request(url, `update:users`, {
      method: 'POST',
      data: {
        permissions,
      },
    });
  }

  async removePermissions(user_id: string, permissions: Partial<API.Permission>): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'permissions');

    return await this.client.request(url, `update:users`, {
      method: 'DELETE',
      data: {
        permissions,
      },
    });
  }
  
  async listRoles(user_id: string, query: API.PageQuery): Promise<API.Page<API.UserRole>> {
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'roles');
  
    return await this.client.request(url, `read:users`, {
      method: 'GET',
      params: query,
    });
  }

  async addRoles(user_id: string, roles: string[]): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'roles');
  
    return await this.client.request(url, `update:users`, {
      method: 'POST',
      data: {
        roles,
      },
    });
  }

  async removeRoles(user_id: string, roles: string[]): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'roles');
  
    return await this.client.request(url, `update:users`, {
      method: 'DELETE',
      data: {
        roles,
      },
    });
  }


  async listGrants(user_id: string, query: API.PageQuery): Promise<API.Page<API.Grant>> {
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'grants');
  
    return await this.client.request(url, `read:users`, {
      method: 'GET',
      params: query,
    });
  }

  async listOrganizations(user_id: string, query: API.PageQuery): Promise<API.Page<API.Organization>> {
    const url = urljoin(this.client.basePath, 'v1', 'users', user_id, 'organizations');
  
    return await this.client.request(url, `read:users read:organizations`, {
      method: 'GET',
      params: query,
    });
  }

}