import { BaseOptions } from '@ahooksjs/use-request/lib/types';
import { useRequest } from 'umi';
import { useBackendAPI } from '@/providers/backend-api/context';
import { ResourceServerEntity } from '@/api/entities/resource-server.entity';

export const useToken = (options?: BaseOptions<API.AccessTokenResult, [API.TokenRequest]>) => {
  const { client } = useBackendAPI();

  return useRequest<API.AccessTokenResult, [API.TokenRequest]>(
    (req: API.TokenRequest) => client.get(ResourceServerEntity).fetchToken(req),
    {
      manual: true,
      formatResult: (data: API.AccessTokenResult) => data,
      ...options,
    },
  );
}