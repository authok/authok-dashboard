import { BaseResult, BaseOptions, OptionsWithFormat } from '@ahooksjs/use-request/lib/types';

import { useRequest } from 'umi';
import { useBackendAPI } from '@/providers/backend-api/context';
import { OrganizationEntity } from '@/api/entities/organization.entity';

export const useOrganizationMembersPaginate = <U = any, UU extends U = any>(
  org_id: string,
  options?: OptionsWithFormat<API.Page<API.OrganizationMember>, [API.PageQuery], U, UU>
): BaseResult<U, [API.PageQuery]> => {
  const { client } = useBackendAPI();

  return useRequest(
    (query: API.PageQuery) => client.get(OrganizationEntity).listMembers(org_id, query),
    {
      formatResult: (data: API.Page<API.OrganizationMember>): U => data as unknown as U,
        manual: false,
      ...options,
    },
  );
}

export const useOrganizationAddMembers = (
  options?: BaseOptions<void, [string, string[]]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    async (org_id: string, members: string[]) => client.get(OrganizationEntity).addMembers(org_id, members),
    {
      formatResult: (data: void) => data,
      manual: true,
      ...options,
    },
  );
}

export const useOrganizationRemoveMembers = (
  options?: BaseOptions<void, [string, string[]]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    async (org_id: string, members: string[]) => client.get(OrganizationEntity).removeMembers(org_id, members),
    {
      formatResult: (data: void) => data,
      manual: true,
      ...options,
    },
  );
}

export const useOrganizationMemberDetails = (org_id: string, member_id: string, options?: BaseOptions<API.OrganizationMember, []>) => {
  const { client } = useBackendAPI();

  return useRequest<API.OrganizationMember, []>(
    (org_id: string, member_id: string) => client.get(OrganizationEntity).getMember(org_id, member_id),
    {
      refreshDeps: [org_id, member_id],
      defaultParams: [org_id, member_id],
      formatResult: (data: API.OrganizationMember) => data,
      manual: false,
      ...options,
    },
  );
}



export const useOrganizationMemberRolesPaginate = <U = any, UU extends U = any>(
  org_id: string,
  member_id: string,
  options?: OptionsWithFormat<API.Page<API.OrganizationMemberRole>, [API.PageQuery] | [], U, UU>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    async (query?: API.PageQuery) => client.get(OrganizationEntity).listMemberRoles(org_id, member_id, query),
    {
      refreshDeps: [org_id, member_id],
      formatResult: (data: API.Page<API.OrganizationMemberRole>): U => data as unknown as U,
        manual: false,
      ...options,
    },
  );
}

export const useOrganizationMemberAddRoles = (
  options?: BaseOptions<void, [string, string, string[]]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (org_id: string, member_id: string, role_ids: string[]) => client.get(OrganizationEntity).addRoles(org_id, member_id, role_ids),
    {
      formatResult: (data: void) => data,
      manual: true,
      ...options,
    },
  );
}

export const useOrganizationMemberRemoveRoles = (
  options?: BaseOptions<void, [string, string, string[]]>
): BaseResult<void, [string, string, string[]]> => {
  const { client } = useBackendAPI();

  return useRequest(
    (org_id: string, member_id: string, role_ids: string[]) => client.get(OrganizationEntity).removeRoles(org_id, member_id, role_ids),
    {
      formatResult: (data: void) => data,
      manual: true,
      ...options,
    },
  );
}

export const useOrganizationAddConnection = (
  options?: BaseOptions<void, [string, API.OrganizationEnabledConnection]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (org_id: string, connection: API.OrganizationEnabledConnection) => client.get(OrganizationEntity).addConnection(org_id, connection),
    {
      formatResult: (data: API.OrganizationEnabledConnection) => data,
      manual: true,
      ...options,
    } as any,
  );
};

export const useOrganizationDeleteConnection = (
  options?: BaseOptions<void, [string, string]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (org_id: string, connection_id: string) => client.get(OrganizationEntity).deleteConnection(org_id, connection_id),
    {
      formatResult: (data: void) => data,
      manual: true,
      ...options,
    } as any,
  );
};

export const useOrganizationUpdateConnection = (
  options?: BaseOptions<void, [string, string, Partial<API.OrganizationEnabledConnection>]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (org_id: string, connection_id: string, connection: Partial<API.OrganizationEnabledConnection>) => client.get(OrganizationEntity).updateConnection(org_id, connection_id, connection),
    {
      formatResult: (data: API.OrganizationEnabledConnection) => data,
      manual: true,
      ...options,
    } as any,
  );
};

export const useOrganizationEnabledConnections = <U = any, UU extends U = any>(
  org_id: string,
  options?: OptionsWithFormat<API.Page<API.OrganizationEnabledConnection>, [API.PageQuery], U, UU>
): BaseResult<U, [API.PageQuery]> => {
  const { client } = useBackendAPI();

  return useRequest(
    (query: API.PageQuery) => client.get(OrganizationEntity).enabledConnections(org_id, query),
    {
      formatResult: (data: API.Page<API.OrganizationEnabledConnection>): U => data as unknown as U,
      manual: false,
      ...options,
    },
  );
}

export const useOrganizationInvitationPaginate = <U = any, UU extends U = any>(
  org_id: string,
  options?: OptionsWithFormat<API.Page<API.Invitation>, [API.PageQuery], U, UU>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (query: API.PageQuery) => client.get(OrganizationEntity).listInvitations(org_id, query),
    {
      refreshDeps: [org_id],
      formatResult: (data: API.Page<API.Invitation>): U => data as unknown as U,
        manual: false,
      ...options,
    },
  );
}

export const useOrganizationSendInvitation = (
  options?: BaseOptions<void, [string, Partial<API.Invitation>]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (org_id: string, invitation: Partial<API.Invitation>) => client.get(OrganizationEntity).sendInvitation(org_id, invitation),
    {
      formatResult: (data: API.Invitation) => data,
      manual: true,
      ...options,
    } as any,
  );
};