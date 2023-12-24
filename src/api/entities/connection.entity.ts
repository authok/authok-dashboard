import { RestfulResource } from "../restful.resource";
import { APIClient } from "../client";

export class ConnectionEntity extends RestfulResource<API.Connection> {
  static api_name = 'connection';

  constructor(client: APIClient) {
    super(client, 'connections', 'v1');
  }
}