declare namespace API {
  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  export interface Page<T> {
    items: T[];
    meta: PageMeta;
  }

  export interface PageMeta {
    page: number;
    total: number;
    limit: number;
  }

  export interface User {
    id: string;
    user_id: string;
    username: string;
    nickname: string;
    name: string; // 姓名
    picture: string;
    email: string;
    email_verified: string;
    phone_number: string;
    phone_number_verified: string;
    gender: string;
    blocked?: boolean;
    loginsCount?: number;
    signup_at: Date;
    last_login: Date;
    connection: string;
    user_metadata: Record<string, any>;
    app_metadata: Record<string, any>;

    identities: Identity[];
  }

  export interface Identity {
    id: string;
    user_id: string;
    provider: string;
    is_social: boolean;
    access_token: string;
    profile_data: any;
    connection: string;
    last_login: Date;
    updated_at: Date;
    created_at: Date;
  }

  export interface LinkIdentityReq {
    provider?: string;
    connection?: string;
    user_id: string;
  }

  export interface Extension {
    id: string;
  }

  export interface Grant {
    id: string;

    user_id: string;
  
    client_id: string;
  
    resources: Record<string, any>;
  
    openid: any;
  
    rejected: any;
  
    data: any;
  
    iat: number;
  
    exp: number;
  
    updated_at: Date;
  
    created_at: Date;
  }

  export interface Log {
    id: string;
    date: Date;
    type: string;
    description: string;
    connection: string;
    connection_id: string;
    client_id: string;
    client_name: string;
    ip: string;
    hostname: string;
    user_id: string;
    username: string;
    audience: string;
    scope: string;
    strategy: string;
    is_mobile: boolean;
    details: Record<string, any>;
    user_agent: string;
    location_info: LocationInfo;
  }

  export class PermissionSource {
    source_id: string;
    source_name: string;
    source_type: string;
  }

  export interface Permission {
    resource_server_identifier: string;
    permission_name: string;
    resource_server_name: string;
    description: string;
    sources: PermissionSourceDto[];
  }

  export interface PostPermissions {
    permissions: {
      resource_server_identifier: string;
      permission_name: string;
    }[];
  }

  export interface PostRoles {
    roles: string[];
  }

  export interface PostUsers {
    users: string[];
  }

  export interface LocationInfo {
    country_code: string;
    country: string;
    city: string;
    latitude: string;
    longitude: string;
    time_zone: string;
  }

  export interface UserLocation {
    uid?: string;
    country?: string;
    province?: string;
    city?: string;
    longitude?: string; // 经度
    latitude?: string; // 纬度
    altitude?: string; // 高度
    updatedAt: Date; // 更新时间
  }

  export interface Role {
    id: string;
    name: string;
    description?: string;
    created_at?: Date;
  }

  export interface Group {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    parent_id?: string;
    order: number;
    created_at?: Date;
    updated_at?: Date;
  }

  export interface EmailTemplate {
    template: string;
    from: string;
    subject: string;
    enabled: boolean;
    result_url: string;
    url_lifetime_in_seconds: number;
    include_email_in_redirect: boolean;
    body: string;
  }

  export interface SmsProvider {
    name: string;
    enabled: boolean;
    settings: any;
    created_at: Date;
    updated_at: Date;
  }

  export interface PageQuery {
    page?: number | 1;
    page_size?: number | 20;
    sort?: string;
    fields?: string;
    [key: string]: any;
  }

  export interface SortType {
    property: string;
    type?: string;
  }

  export type Order = 'ASC' | 'DESC';
  
  export class CursorQuery {
    [key: string]: any;
    first?: number;    
    after?: string;  
    last?: number;
    before?: string;  
    order?: Order;  
    sorter?: string;
  }
  
  export interface Edge<T> {
    cursor: string;
    node: T;
  }
  
  export interface CursorResult<T> {
    total?: number;
    data: Edge<T>[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  }

  export interface Metric {
    key: string;
    value: string;
    period: string;
    time: Date;
  }

  export interface UserRole {
    user?: Partial<User>;
    role: Role;
    created_at: Date;
  }

  export interface Organization {
    id: string;
    code: string;
    name: string;
    description?: string;
    metadata: Record<string, any>;
    branding: Branding;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface OrganizationEnabledConnection {
    connection_id: string;
    assign_membership_on_login?: boolean;
    connection?: API.Connection;
  }

  export interface OrganizationMember {
    id: string;
    user: Partial<API.User>;
    roles: OrganizationMemberRole[];
  }

  export interface OrganizationMemberRole {
    member?: Partial<OrganizationMember>;
    role: Role;
    created_at: Date;
  }

  export interface OrganizationAddMembers {
    members: string[];
  }

  export interface OrganizationRemoveMembers {
    members: string[];
  }

  export interface OrganizationMemberAddRoles {
    roles: string[];
  }

  export interface OrganizationMemberRemoveRoles {
    roles: string[];
  }

  export interface Invitation {
    id: string;
    invitation_url: string;
    client_id: string;
    inviter: Partial<API.User>;
    invitee: Record<string, any>;
    connection: string;
    token: string;
    roles: string[];  
    created_at: Date;  
    expires_at: Date;
  }

  export interface Branding {
    colors: Record<string, string>;
  }

  export class Node<T> {
    id: string;
    type: string;
    data: T;
  }

  export interface Statement {
    resource?: string;
    actions?: Action[];
    effect?: string;
  }

  export interface Policy {
    id?: string;
    code?: string;
    isDefault?: string;
    statements?: Statement[];
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userPoolId?: string;
  }

  export interface PolicyAssignment {
    id?: string;
    policyId?: string;
    policy?: Policy;
    targetType?: string;
    target?: any;
    targetIdentifier?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface SocialApp {
    id?: string;
    schema?: any; // 字段配置
    protocol?: string; // oauth
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    provider?: string;
    logo?: string;
    connection?: SocialConnection;
  }

  export interface Scope {
    description?: string;
    value?: string;
  }

  export interface ResourceServer {
    id: string;
    name: string;
    identifier: string;
    scopes: Scope[];
    is_system: boolean;
  }

  export interface Tenant {
    id: string;
    name: string;
    display_name: string;
    region: string;
    environment: string;
    domain: string;
    createdAt?: Date;
    updatedAt?: Date;

    enabled_locales: string[];
    error_page?: Record<string, any>;
  }

  export interface SmsConfig {
    secretId: string;
    secretKey: string;
    smsSdkAppid: string;
    loginSignature: string;
    loginTemplate: string;
    loginExpiresIn: string;
    resetPasswordSignature: string;
    resetPasswordTemplate: string;
    resetPasswordExpiresIn: string;
  }

  export class Region {
    name: string;
    display_name: string;
  }

  export interface Connection {
    id: string;
    name: string;
    display_name: string;
    strategy: string;
    enabled_clients: string[];
    options: Record<string, any>;
  }

  export interface Application {
    client_id: string;
    name: string;
    display_name: string;
    app_type: string;
    client_secret: string;
    description: string;
    logo_uri: string;
    redirect_uris: string[];
    allowed_logout_urls: string[];
    web_origins: string[];
    allowed_origins: string[];
    client_metadata: Record<string, any>;
    form_template: string;
    signing_keys: API.SigningKey[];
    mobile: Record<string, any>;
    addons: Record<string, any>;
  }

  export interface Organization {
    id: string;
    name: string;
    display_name: string;
    logo_uri: string;
  }

  export interface ClientGrant {
    id: string;
    client_id: string;
    audience: string;
    scope: string[];
  }

  export interface TokenRequest {
    audience: string;
    client_id: string; 
    client_secret: string;
  }

  export interface AccessTokenResult {
    access_token: string;
    expires_in: number;
    token_type: string;
  }

  export interface SigningKey {
    cert: string;
    pkcs8: string;
    subject: string;
    next: boolean;
    current: boolean;
    previous: boolean;
    revoked: boolean;
    fingerprint: string;
    thumbprint: string;
  }

  export interface Config {
    name: string;
    value: any;
    enabled: boolean;
    created_at: Date;
    updated_at: Date;
  }

  export interface CatpchaProvider {
    name: string;
    title: string;
    syntax: string;
    schema: any;
  }

  export interface Factor {
    name: string;
    title: string;
    description: string;
  }

  export interface FactorProvider {
    name: string;
    schema: string;
  }

  export interface Addon {
    key: string;
    name: string;
    icon: string;
    enabled: boolean;
    schema: any;
    usage: string;
  }

  export interface FactorConfig {
    name: string;
    enabled: boolean;
    value: Record<string, any>;
  }

  export interface Catalog {
    id: string;
    catalog_id: string;
    slug: string;
    icon: string;
    name: string;
    readme: string;
    companyName: string;
    metaTitle: string;
    metaDescription: string;
    categories: string[];
    feature: Feature;
    gallery: Gallery[];
    creationUri: string;
  }

  export interface Gallery {
    image: string;
    title: string;
    description: string;
  }

  export interface Category {
    id: string;
    name: string;
    slug: string;
  }

  export interface Feature {
    label: string;
    name: string;
    slug: string;
  }

  export interface Trigger {
    id: string;
    display_name: string;
    version: string;
    runtimes: string[];  
    default_runtime: string;  
    status: string;
  }

  export interface TriggerBinding {
    id: string;  
    trigger_id: string;
    display_name: string;  
    action: ActionDto;
    created_at: Date;  
    updated_at: Date;
  }

  export class BindingActionReference {
    type: string;
    value: string;
  }

  export class UpdateBinding {
    ref: BindingActionReference;
    display_name: string;
  }

  export interface BindingsUpdateRequest {
    bindings: UpdateBinding[];
  }

  export interface ActionDependency {
    name: string;
    version: string;
  }

  export interface ActionSecret {
    name: string;
    value: string;
  }

  export interface Action {
    id: string;
    name: string;
    supported_triggers: Trigger[];
    code: string;
    dependencies: ActionDependency[];
    runtime: string;  
    secrets: ActionSecret[];  
    deployed_version: string;
    installed_integration_id: string;  
    status: string;  
    all_changes_deployed: boolean;  
    built_at: Date;
    created_at: Date;
    updated_at: Date;
  }

  export interface TriggerEvent {
    [key: string]: any;
  }
}
