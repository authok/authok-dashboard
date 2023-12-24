import { IResource } from "./resource";
import { APIClient } from "./client";

export class BaseEntity implements IResource {
  protected client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }
}