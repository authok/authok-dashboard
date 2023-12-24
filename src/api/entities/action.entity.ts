import urljoin from 'url-join';
import { RestfulResource } from "../restful.resource";
import { APIClient } from '../client';

export class ActionEntity extends RestfulResource<API.Action> {
  static api_name: string = "action";
  
  constructor(client: APIClient) {
    super(client, 'actions', 'v1');
  }

  async listTriggerBindings(trigger_id: string): Promise<Page<API.TriggerBinding>> {
    const url = urljoin(this.client.basePath, 'v1', 'actions', 'triggers', trigger_id, 'bindings')    
    return await this.client.request(url, `read:actions`, {
      method: 'GET',
    });
  }

  async updateTriggerBindings(trigger_id: string, data: API.BindingsUpdateRequest): Promise<API.TriggerBinding[]> {
    const url = urljoin(this.client.basePath, 'v1', 'actions', 'triggers', trigger_id, 'bindings')
    return await this.client.request(url, `update:actions`, {
      method: 'PATCH',
      data,
    });
  }

  async test(id: string, data: API.TriggerEvent): Promise<any> {
    const url = urljoin(this.client.basePath, 'v1', 'actions', id, 'test')
    return await this.client.request(url, `read:actions`, {
      method: 'POST',
      data,
    });
  }
}