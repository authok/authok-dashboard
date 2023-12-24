import urljoin from 'url-join';
import { IResource } from "../restful.resource";
import { APIClient } from '../client';

export class GuardianEntity implements IResource {
  static api_name = 'guardian';

  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async listFactors(): Promise<API.Factor[]> {
    const url = urljoin(this.client.basePath, 'v1', 'guardian', 'factors');
    return await this.client.request(url, 'read:guardian_factors', {
      method: 'GET',
    });
  }

  async getFactor(name: string): Promise<API.Factor | undefined> {
    const url = urljoin(this.client.basePath, 'v1', 'guardian', 'factors', name);
    return await this.client.request(url, `read:guardian_factors`, {
      method: 'GET',
    });
  }

  async getFactorConfigs(): Promise<API.FactorConfig[]> {
    const url = urljoin(this.client.basePath, 'v1', 'guardian', 'factors', 'configs');
    return await this.client.request(url, `read:guardian_factors`, {
      method: 'GET',
    });
  }

  async getFactorConfig(factor: string): Promise<API.FactorConfig> {
    const url = urljoin(this.client.basePath, 'v1', 'guardian', 'factors', factor, 'configs');
    return await this.client.request(url, `read:guardian_factors`, {
      method: 'GET',
    });
  }

  async updateFactorConfig(factor: string, data: Partial<API.FactorConfig>): Promise<API.FactorConfig> {
    const url = urljoin(this.client.basePath, 'v1', 'guardian', 'factors', factor, 'configs');
    return await this.client.request(url, `read:guardian_factors`, {
      method: 'PUT',
      data,
    });
  }

  async getFactorProviders(factor: string): Promise<API.FactorProvider[]> {
    const url = urljoin(this.client.basePath, 'v1', 'guardian', 'factors', factor, 'providers');
    return await this.client.request(url, `read:guardian_factors`, {
      method: 'GET',
    });
  }

  async getFactorProvider(factor: string, provider: string): Promise<API.FactorProvider> {
    const url = urljoin(this.client.basePath, 'v1', 'guardian', 'factors', factor , 'providers', provider);

    return await this.client.request(url, `read:guardian_factors`, {
      method: 'GET',
    });
  }
}