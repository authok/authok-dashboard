import { useBackendAPI } from "@/providers/backend-api/context";
import { useRequest } from "umi";
import { IRestfulResource, ObjectType } from '@/api';
import { BaseOptions, OptionsWithFormat } from "@ahooksjs/use-request/lib/types";

export const useResourceCreate = <S extends IRestfulResource<R>, R = any>(
  resource: ObjectType<S>, 
  options?: BaseOptions<R, [Partial<R>]>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (data: Partial<R>) => client.get(resource).create(data),
    {
      manual: true,
      formatResult: (data: R) => data,
      ...options,
    }
  );
}

export const useResourceUpdate = <S extends IRestfulResource<R>, R = any>(
  resource: ObjectType<S>,
  options?: BaseOptions<R, [string, Partial<R>]>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (id: string, data: Partial<R>) => client.get(resource).update(id, data),
    {
      manual: true,
      formatResult: (data: R) => data,
      ...options,
    }
  );
}

export const useResourceDetails = <S extends IRestfulResource<R>, R = any>(
  resource: ObjectType<S>,
  id: string, 
  options?: BaseOptions<R, [string]>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (id: string) => client.get(resource).get(id),
    {
      manual: false,
      defaultParams: [id],
      formatResult: (data: R) => data,
      ...options,
    },
  );
}

export const useResourceDelete = <S extends IRestfulResource<R>, R = any>(
  resource: ObjectType<S>,
  options?: BaseOptions<void, [string]>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (id: string) => client.get(resource).delete(id),
    {
      manual: true,
      formatResult: (data: R) => data,
      ...options,
    },
  );
}

export const useResourcePagination = <S extends IRestfulResource<ITEM>, ITEM = any, U = any, UU extends U = any>(
  resource: ObjectType<S>,
  options?: OptionsWithFormat<API.Page<ITEM>, [API.PageQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.PageQuery) => client.get(resource).paginate(query),
    {
      manual: false,
      formatResult: (data: API.Page<ITEM>) => data,
      ...options,
    },
  );
}

export const useResourceCursorList = <S extends IRestfulResource<ITEM>, ITEM = any, U = any, UU extends U = any>(
  resource: ObjectType<S>,
  options: OptionsWithFormat<API.CursorResult<ITEM>, [API.CursorQuery], U, UU>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.CursorQuery) => client.get(resource).cursor(query),
    {
      manual: false,
      formatResult: (data: API.CursorResult<ITEM>) => data,
      ...options,
    },
  );
}