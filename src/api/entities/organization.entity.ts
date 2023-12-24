import urljoin from 'url-join';
import { RestfulResource } from "../restful.resource";
import { query } from '@/pages/account/settings/service';
import { APIClient } from '../client';

export class OrganizationEntity extends RestfulResource<API.Organization> {
  static api_name = 'organization';

  constructor(client: APIClient) {
    super(client, 'organizations', 'v1');
  }

  async addConnection(org_id: string, connection: API.OrganizationEnabledConnection) {
    const url = urljoin(this.client.basePath,'v1', 'organizations', org_id, 'enabled_connections');

    return await this.client.request(url, `read:organizations`, {
      method: 'POST',
      data: connection,
    });
  }

  async deleteConnection(org_id: string, connection_id: string) {
    const url = urljoin(this.client.basePath,'v1', 'organizations', org_id, 'enabled_connections', connection_id);

    return await this.client.request(url, `delete:organizations`, {
      method: 'DELETE',
    });
  }

  async updateConnection(org_id: string, connection_id: string, connection: Partial<API.OrganizationEnabledConnection>) {
    const url = urljoin(this.client.basePath,'v1', 'organizations', org_id, 'enabled_connections', connection_id);

    return await this.client.request(url, `update:organizations`, {
      method: 'PATCH',
      data: connection,
    });
  }

  async enabledConnections(org_id: string, query: API.PageQuery): Promise<API.Page<API.OrganizationEnabledConnection>> {
    const url = urljoin(this.client.basePath,'v1', 'organizations', org_id, 'enabled_connections');

    return await this.client.request(url, `read:organizations`, {
      method: 'GET',
      params: query,
    });
  }

  async listMembers(org_id: string, query: API.PageQuery): Promise<API.Page<API.OrganizationMember>> {
    const url = urljoin(this.client.basePath,'v1', 'organizations', org_id, 'members');

    return await this.client.request(url, `read:organizations`, {
      method: 'GET',
      params: query,
    });
  }

  async addMembers(org_id: string, members: string[]): Promise<void> {
    const url = urljoin(this.client.basePath,'v1', 'organizations', org_id, 'members');

    return await this.client.request(url, `update:organizations`, {
      method: 'POST',
      data: {
        members,
      },
    });
  }

  async removeMembers(org_id: string, members: string[]): Promise<void> {
    const url = urljoin(this.client.basePath,'v1', 'organizations', org_id, 'members');

    return await this.client.request(url, `update:organizations`, {
      method: 'DELETE',
      data: {
        members,
      },
    });
  }

  async getMember(org_id: string, member_id: string): Promise<API.OrganizationMember> {
    const url = urljoin(this.client.basePath,'v1', 'organizations', org_id, 'members', member_id);

    return await this.client.request(url, `read:organizations`, {
      method: 'GET',
    });
  }

  async listMemberRoles(org_id: string, member_id: string, query: API.PageQuery): Promise<API.Page<API.OrganizationMemberRole>> {
    const url = urljoin(this.client.basePath, 'v1', 'organizations', org_id, 'members', member_id, 'roles');

    return await this.client.request(url, `read:organizations`, {
      method: 'GET',
      params: query,
    });
  }

  async addRoles(org_id: string, member_id: string, roles: string[]): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'organizations', org_id, 'members', member_id, 'roles');

    return await this.client.request(url, `update:organizations`, {
      method: 'POST',
      data: {
        roles,
      },
    });
  }

  async removeRoles(org_id: string, member_id: string, roles: string[]): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'organizations', org_id, 'members', member_id, 'roles');

    return await this.client.request(url, `update:organizations`, {
      method: 'DELETE',
      data: {
        roles,
      },
    });
  }

  async listInvitations(org_id: string, query: API.PageQuery): Promise<API.Page<API.Invitation>> {
    const url = urljoin(this.client.basePath, 'v1', 'organizations', org_id, 'invitations');

    return await this.client.request(url, `read:organizations`, {
      method: 'GET',
      params: query,
    });
  }

  async sendInvitation(org_id: string, invitation: Partial<API.Invitation>): Promise<API.Invitation> {
    const url = urljoin(this.client.basePath, 'v1', 'organizations', org_id, 'invitations') 
  
    return await this.client.request(url, `update:organizations`, {
      method: 'POST',
      data: invitation,
    });
  }

  async removeInvitation(org_id: string, id: string): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'organizations', org_id, 'invitations', id) 
  
    return await this.client.request(url, `update:organizations`, {
      method: 'DELETE',
    });
  }
}