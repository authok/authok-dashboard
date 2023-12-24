import urljoin from 'url-join';
import { BaseEntity } from '../base.entity';

export class TenantEntity extends BaseEntity {
  static api_name = 'tenant';

  async get(): Promise<API.Tenant> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants', 'settings') 

    return await this.client.request(url, `read:tenant_settings`, {
      method: 'GET',
    }); 
  }

  async create(data: Partial<API.Tenant>): Promise<API.Tenant> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants') 

    return await this.client.request(url, `create:tenant`, {
      method: 'POST',
      data,
    }); 
  }

  async update(data: Partial<API.Tenant>): Promise<API.Tenant> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants', 'settings') 

    return await this.client.request(url, `update:tenant_settings`, {
      method: 'PATCH',
      data,
    }); 
  }

  async listTenants(): Promise<API.Tenant[]> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants') 

    return await this.client.request(url, `read:tenant_settings`, {
      method: 'GET',
    });
  }

  async listMembers(query: API.PageQuery): Promise<API.Page<API.OrganizationMember>> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants', 'members') 

    return await this.client.request(url, `read:tenant_settings`, {
      method: 'GET',
      query,
    });
  }

  async listRoles(query: API.PageQuery): Promise<API.Page<API.Role>> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants', 'roles') 

    return await this.client.request(url, `read:tenant_settings`, {
      method: 'GET',
      query,
    });
  }

  async sendInvitation(invitation: Partial<API.Invitation>): Promise<API.Invitation> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants', 'invitations') 
  
    return await this.client.request(url, `read:tenant_settings`, {
      method: 'POST',
      data: invitation,
    });
  }

  async removeInvitation(id: string): Promise<void> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants', 'invitations', id) 
  
    return await this.client.request(url, `update:tenant_settings`, {
      method: 'DELETE',
    });
  }

  async listInvitations(query: API.PageQuery): Promise<API.Page<API.Invitation>> {
    const url = urljoin(this.client.basePath, 'v1', 'tenants', 'invitations') 

    return await this.client.request(url, `read:tenant_settings`, {
      method: 'GET',
      query,
    });
  }
}