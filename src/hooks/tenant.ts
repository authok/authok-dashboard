import { useRequest } from "umi";
import { OptionsWithFormat, BaseOptions, BaseResult } from '@ahooksjs/use-request/lib/types';
import { useBackendAPI } from "@/providers/backend-api/context";
import { TenantEntity } from "@/api/entities/tenant.entity";
import useTenantContext from "@/providers/tenant/useTenantContext";

export const useTenantDetails = (options?: BaseOptions<API.Tenant, [string]>): BaseResult<API.Tenant, [string]> => {
  const { client } = useBackendAPI();
  const { tenant } = useTenantContext();

  return useRequest<API.Tenant, [string]>(
    () => client.get(TenantEntity).get(), 
    {
      manual: false,
      formatResult: (data: API.Tenant) => data,
      cacheKey: tenant,
      cacheTime: 60 * 60 * 1000,
      ...options,
    },
  );
}

export const useTenantCreate = (options?: BaseOptions<API.Tenant, [Partial<API.Tenant>]>) => {
  const { client } = useBackendAPI();

  return useRequest(
    (data: Partial<API.Tenant>) => client.get(TenantEntity).create(data), 
    {
      manual: true,
      formatResult: (data: API.Tenant) => data,
      ...options,
    },
  );
}

export const useTenantUpdate = (options?: BaseOptions<API.Tenant, [Partial<API.Tenant>]>) => {
  const { client } = useBackendAPI();

  return useRequest(
    (data: Partial<API.Tenant>) => client.get(TenantEntity).update(data), 
    {
      manual: true,
      formatResult: (data: API.Tenant) => data,
      ...options,
    },
  );
}

export const useTenants = (
  options?: BaseOptions<API.Tenant[], []>,
) => {
  const { client } = useBackendAPI();

  return useRequest(
    () => client.get(TenantEntity).listTenants(), 
    {
      cacheKey: 'tenants',
      cacheTime: 3000,  
      formatResult: (data: API.Tenant[]) => data,
      manual: false,
      ...options,
    },
  );
}

export const useTenantMembers = <U = any, UU extends U = any>(
  options?: OptionsWithFormat<API.Page<API.OrganizationMember>, [API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.PageQuery) => client.get(TenantEntity).listMembers(query),
    {
      manual: false,
      formatResult: (data: API.Page<API.OrganizationMember>) => data,
      ...options,
    } as any,
  );
}

export const useTenantRolePagination = <U = any, UU extends U = any>(
  options?: OptionsWithFormat<API.Page<API.Role>, [API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.PageQuery) => client.get(TenantEntity).listRoles(query),
    {
      manual: false,
      formatResult: (data: API.Page<API.Role>) => data,
      ...options,
    } as any,
  );
}

export const useTenantSendInvitation = (
  options?: BaseOptions<API.Invitation, [Partial<API.Invitation>]>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (invitation: Partial<API.Invitation>) => client.get(TenantEntity).sendInvitation(invitation),
    {
      manual: true,
      formatResult: (data: API.Invitation) => data,
      ...options,
    },
  );
};

export const useTenantMemberInvitationRemove = (
  options?: BaseOptions<void, [string]>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (id: string) => client.get(TenantEntity).removeInvitation(id),
    {
      manual: true,
      formatResult: (data: any) => data,
      ...options,
    },
  );
};

export const useTenantMemberInvitations = <U = any, UU extends U = any>(
  options?: OptionsWithFormat<API.Page<API.Invitation>, [API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.PageQuery) => client.get(TenantEntity).listInvitations(query),
    {
      manual: false,
      formatResult: (data: API.Page<API.Invitation>) => data,
      ...options,
    } as any,
  );
};