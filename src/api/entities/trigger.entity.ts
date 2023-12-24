import { RestfulResource } from "../restful.resource";
import { APIClient } from '../client';

export class TriggerEntity extends RestfulResource<API.Trigger> {
  static api_name = 'trigger';

  constructor(client: APIClient) {
    super(client, 'triggers', 'v1');
  }

}