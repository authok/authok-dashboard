import { RestfulResource } from "../restful.resource";
import { APIClient } from "../client";

export class EmailTemplateEntity extends RestfulResource<API.EmailTemplate> {
  static api_name = 'email-template';

  constructor(client: APIClient) {
    super(client, 'email-templates', 'v1', 'email_templates');
  }
}