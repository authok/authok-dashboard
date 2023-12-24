import { BaseOptions } from '@ahooksjs/use-request/lib/types';

import { useRequest } from 'umi';
import { useBackendAPI } from '@/providers/backend-api/context';
import { SigningKeyEntity } from '@/api/entities/signing-key.entity';

export const useSigningKeys = (
    options?: BaseOptions<API.SigningKey[], []>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    () => client.get(SigningKeyEntity).list(), 
    {
      manual: false,
      formatResult: (data: API.SigningKey[]) => data,
      ...options,
    },
  );
};


export const useRotateSigningKeys = (
  options?: BaseOptions<API.SigningKey, []>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    () => client.get(SigningKeyEntity).rotate(), 
    {
      manual: true,
      formatResult: (data: API.SigningKey) => data,
      ...options,
    },
  );
};