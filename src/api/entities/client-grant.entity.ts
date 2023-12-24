import { RestfulResource } from "../restful.resource";
import { APIClient } from "../client";

export class ClientGrantEntity extends RestfulResource<API.ClientGrant> {
  static api_name = 'client-grant';

  constructor(client: APIClient) {
    super(client, 'client-grants', 'v1', 'client_grants');
  }
}