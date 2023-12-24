import { BaseResult, BaseOptions, PaginatedParams, OptionsWithFormat } from "@ahooksjs/use-request/lib/types";
import { formatPageQuery } from '@/utils/utils';
import { useRequest } from 'umi';
import { useBackendAPI } from "@/providers/backend-api/context";
import { RoleEntity } from "@/api";

export const useRolePermissionPagination = <U = any, UU extends U = any>(
  role_id: string, 
  options?: OptionsWithFormat<API.Page<API.Permission>, [API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();

  return useRequest(  
    (query: API.PageQuery) => client.get(RoleEntity).listPermissions(role_id, query),
    {
      formatResult: (data: API.Page<API.Permission>) => data as unknown as U,
      ...options,
    } as any,
  );
}

export const useAddPermissionsToRole = (
  options?: BaseOptions<void, [string, API.Permission[]]>
): BaseResult<void, [string, API.Permission[]]> => {
  const { client } = useBackendAPI();
  return useRequest((role_id: string, permissions: API.Permission[]) => client.get(RoleEntity).addPermissions(role_id, permissions), {
    manual: true,
    formatResult: (data: any) => data,
    ...options,
  });
}

export const useRemovePermissionsToRole = (options?: BaseOptions<void, [string, API.Permission[]]>) => {
  const { client } = useBackendAPI();

  return useRequest(async (role_id: string, permissions: API.Permission[]) => client.get(RoleEntity).removePermissions(role_id, permissions), {
    manual: true,
    formatResult: (data: any) => data,
    ...options,
  });
}


export const useRoleUserPagination = <U = any, UU extends U = any>(
  role_id: string, 
  options?: OptionsWithFormat<API.Page<API.User>, PaginatedParams, U, UU>,
): BaseResult<U, PaginatedParams> => {
  const { client } = useBackendAPI();

  return useRequest(async (params, sorter, filter) => {
    const query = formatPageQuery(params, sorter, filter);    

    return await client.get(RoleEntity).listUsers(role_id, query);
  }, {
    formatResult: (data: API.Page<API.User>) => data as unknown as U,
    ...options,
  });
}

export const useAssignUsersToRole = (options?: BaseOptions<any, [string, string[]]>) => {
  const { client } = useBackendAPI();

  return useRequest(async (role_id: string, user_ids: string[]) => client.get(RoleEntity).assignUsers(role_id, user_ids), {
    manual: true,
    formatResult: (data: any) => data,
    ...options,
  });
}


export const useRemoveUsersToRole = (options?: BaseOptions<any, [string, string[]]>) => {
  const { client } = useBackendAPI();

  return useRequest(async (role_id: string, user_ids: string[]) => client.get(RoleEntity).unassignUsers(role_id, user_ids), {
    manual: true,
    formatResult: (data: any) => data,
    ...options,
  });
}