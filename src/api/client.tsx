import { RequestFn } from '@/hooks/useRequestWithToken';
import { ActionEntity, ClientGrantEntity, ConnectionEntity, RoleEntity, ClientEntity } from './entities';
import { IResource } from './resource';
import { CatalogEntity } from './entities/catalog.entity';
import { ConfigEntity } from './entities/config.entity';
import { EmailTemplateEntity } from './entities/email-template.entity';
import { FormSchemaEntity } from './entities/form-schema.entity';
import { GuardianEntity } from './entities/guardian.entity';
import { OrganizationEntity } from './entities/organization.entity';
import { ResourceServerEntity } from './entities/resource-server.entity';
import { GroupEntity } from './entities/group.entity';
import { TriggerEntity } from './entities/trigger.entity';
import { UserEntity } from './entities/user.entity';
import { TenantEntity } from './entities/tenant.entity';
import { LogEntity } from './entities/log.entity';
import { SigningKeyEntity } from './entities/signing-key.entity';
import { ProfileEntity } from './entities/profile.entity';
import urljoin from 'url-join';
import { StatsEntity } from './entities/stats.entity';
import { CategoryEntity } from './entities/category.entity';
import { FeatureEntity } from './entities/feature.entity';

export declare type ObjectType<T> = {
  new (client: APIClient): T;
} | Function;

export class APIClient {
  host: string;
  path: string;
  basePath: string;
  requestFn: RequestFn;
  resources: Record<string, IResource>;

  constructor(host: string, path: string, requestFn: RequestFn) {
    this.host = host;
    this.path = path;
    this.basePath = urljoin(this.host, this.path);
    this.requestFn = requestFn;
    this.resources = {};
    this.init();
  }

  private init() {
    this.set(new ActionEntity(this));
    this.set(new CatalogEntity(this));
    this.set(new CategoryEntity(this));
    this.set(new FeatureEntity(this));
    this.set(new ClientGrantEntity(this));
    this.set(new ClientEntity(this));
    this.set(new ConfigEntity(this));
    this.set(new ConnectionEntity(this));
    this.set(new EmailTemplateEntity(this));
    this.set(new FormSchemaEntity(this));
    this.set(new GroupEntity(this));
    this.set(new GuardianEntity(this));
    this.set(new OrganizationEntity(this));
    this.set(new ResourceServerEntity(this));    
    this.set(new RoleEntity(this));
    this.set(new TenantEntity(this));
    this.set(new TriggerEntity(this));
    this.set(new UserEntity(this));
    this.set(new LogEntity(this));
    this.set(new SigningKeyEntity(this));
    this.set(new ProfileEntity(this));
    this.set(new StatsEntity(this));
  }

  async request<R>(url: string, scope: string, options?: any): Promise<R> {
    return this.requestFn<R>(url, scope, options);
  }

  get<S extends IResource>(type: ObjectType<S>): S {
    return this.resources[type['api_name']] as S;
  }

  set<S extends IResource>(resource: S) {
    this.resources[resource.constructor['api_name']] = resource;
  }
}