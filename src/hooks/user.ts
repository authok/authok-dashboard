import { useRequest } from 'umi';
import { BaseOptions, OptionsWithFormat } from '@ahooksjs/use-request/lib/types';
import { useBackendAPI } from '@/providers/backend-api/context';
import { UserEntity } from '@/api/entities/user.entity';

export const useUserBatchDelete = (options?: BaseOptions<any, [string[]]>) => {
  const { client } = useBackendAPI();

  return useRequest(
    (user_ids: string[]) => client.get(UserEntity).batchDelete(user_ids),
    {
      manual: true,
      formatResult: (data: any) => data,
      ...options,
    }
  );
}

export const useLinkIdentity = (
  options?: BaseOptions<API.Identity[], [string, API.LinkIdentityReq]>,
) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    userEntity.linkIdentity.bind(userEntity),
    {
      manual: true,
      formatResult: (data: API.Identity[]) => data,
      ...options,
    }
  );
};

export const useUnlinkIdentity = (
  options?: BaseOptions<API.Identity[], [string, string, string]>,
) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    userEntity.unlinkIdentity.bind(userEntity),
    {
      manual: true,
      formatResult: (data: any) => data,
      ...options,
    }
  );
};

export const useUserLogPagination = <U = any, UU extends U = any>(
  user_id: string, 
  options?: OptionsWithFormat<API.CursorResult<API.Log>, [API.CursorQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest((query: API.CursorQuery) => userEntity.listLogEvents(user_id, query), {
    manual: false,
    formatResult: (data: API.CursorResult<API.Log>) => data as unknown as U,
    ...options,
  });
}

export const useUserPermissionPagination =  <U = any, UU extends U = any>(
  user_id: string, 
  options?: OptionsWithFormat<API.Page<API.Permission>, [API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    (query: API.PageQuery) => userEntity.listPermissions(user_id, query),
    {
      formatResult: (data: API.Page<API.Permission>) => data as unknown as U,
      ...options,
    } as any
  );
}

export const useAddPermissionsToUser = (options?: BaseOptions<any, [string, Partial<API.Permission>[]]>) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    userEntity.addPermissions.bind(userEntity),
    {
      manual: true,
      ...options,
    } as any,
  );
}

export const useRemovePermissionsToUser = (options?: BaseOptions<any, [string, Partial<API.Permission>[]]>) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    userEntity.removePermissions.bind(userEntity),
    {
      manual: true,
      formatResult: (data: any) => data,
      ...options,
    } as any,
  );
}

export const useUserRolePagination = <U = any, UU extends U = any>(
  user_id: string, 
  options?: OptionsWithFormat<API.Page<API.UserRole>, [API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    (query: API.PageQuery) => userEntity.listRoles(user_id, query),
    {
      formatResult: (data: API.Page<API.Role>) => data,
      manual: false,
      ...options,
    } as any,
  );
}

export const useAddRolesToUser = (options?: BaseOptions<any, [string, string[]]>) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    userEntity.addRoles.bind(userEntity),
    {
      manual: true,
      formatResult: (data: any) => data,
      ...options,
    }
  );
}

export const useRemoveRolesToUser = (options?: BaseOptions<any, [string, stirng[]]>) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    userEntity.removeRoles.bind(userEntity),
    {
      manual: true,
      formatResult: (data: any) => data,
      ...options,
    }
  );
}

export const useUserGrants = <U = any, UU extends U = any>(
  user_id: string, 
  options?: OptionsWithFormat<API.Page<API.Grant>, [string, API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    (query: API.PageQuery) => userEntity.listGrants(user_id, query), 
    {
      formatResult: (data: API.Page<API.Grant>) => data,
      manual: false,
      ...options,
    } as any,
  );
}


export const useUserOrganizations = <U = any, UU extends U = any>(
  user_id: string, 
  options?: OptionsWithFormat<API.Page<API.Organization>, [string, API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  const userEntity = client.get(UserEntity);

  return useRequest(
    (query: API.PageQuery) => userEntity.listOrganizations(user_id, query), 
    {
      formatResult: (data: API.Page<API.Grant>) => data,
      manual: false,
      ...options,
    } as any,
  );
}