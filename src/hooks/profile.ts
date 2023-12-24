import { BaseOptions } from '@ahooksjs/use-request/lib/types';

import { useRequest } from 'umi';
import { useBackendAPI } from '@/providers/backend-api/context';
import { ProfileEntity } from '@/api/entities/profile.entity';

export const useProfile = (
    options?: BaseOptions<API.User, []>
) => {
  const { client } = useBackendAPI();

  return useRequest<API.User>(
    () => client.get(ProfileEntity).userinfo(), 
    {
      manual: false,
      formatResult: (data: API.User) => data,
      ...options,
    },
  );
}