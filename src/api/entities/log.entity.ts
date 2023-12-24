import { RestfulResource } from "../restful.resource";
import { APIClient } from "../client";

export class LogEntity extends RestfulResource<API.Log> {
  static api_name = 'log';

  constructor(client: APIClient) {
    super(client, 'logs', 'v1');
  }
}