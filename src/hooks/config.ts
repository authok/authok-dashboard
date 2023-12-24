import { BaseOptions, PaginatedParams, OptionsWithFormat } from '@ahooksjs/use-request/lib/types';
import { useRequest } from 'umi';
import { useBackendAPI } from '@/providers/backend-api/context';
import { ConfigEntity } from '@/api/entities/config.entity';

export const useConfigSet = (options?: BaseOptions<API.Config, [string, string, Partial<API.Config>]>) => {
  const { client } = useBackendAPI();
  const configEntity = client.get(ConfigEntity);

  return useRequest(
    configEntity.set.bind(configEntity), 
    {
      manual: true,
      formatResult: (data: API.Config) => data,
      ...options,
    }
  );
}

export const useConfigDetails = (namespace: string, name: string, options?: BaseOptions<API.Config, []>) => {
  const { client } = useBackendAPI();
  const configEntity = client.get(ConfigEntity);

  return useRequest(
    configEntity.get.bind(configEntity), 
    {
      manual: false,
      defaultParams: [namespace, name],
      formatResult: (data: API.Config) => data,
      ...options,
    } as any,
  );
}

export const useConfigPagination = <U = any, UU extends U = any>(
  options?: OptionsWithFormat<API.Page<API.Config>, [API.PageQuery], U, UU>
) => {
  const { client } = useBackendAPI();
  const configEntity = client.get(ConfigEntity);

  return useRequest(
    configEntity.list.bind(configEntity), 
    {
      manual: false,
      formatResult: (data: API.Page<API.Config>) => data,
      ...options,
    } as any,
  );
}