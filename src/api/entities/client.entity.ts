import { RestfulResource } from "../restful.resource";
import { APIClient } from "../client";

export class ClientEntity extends RestfulResource<API.Application> {
  static api_name = 'client';

  constructor(client: APIClient) {
    super(client, 'clients', 'v1');
  }
}