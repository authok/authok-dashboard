import { RestfulResource } from "../restful.resource";
import { APIClient } from "../client";

export class GroupEntity extends RestfulResource<API.Group> {
  static api_name = 'group';

  constructor(client: APIClient) {
    super(client, 'groups', 'v1');
  }
}