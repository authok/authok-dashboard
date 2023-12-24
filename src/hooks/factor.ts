import { BaseOptions, BaseResult } from '@ahooksjs/use-request/lib/types';

import { useRequest } from 'umi';
import { GuardianEntity } from '@/api/entities/guardian.entity';
import { useBackendAPI } from '@/providers/backend-api/context';

export const useFactors = (
  options?: BaseOptions<API.Factor, []>,
) => {
  const { client } = useBackendAPI();

  return useRequest<API.Factor[]>(() => client.get(GuardianEntity).listFactors(), {
    manual: false,
    formatResult: (data: API.Factor[]) => data,
    ...options,
  });
}

export const useFactorDetails = (
  factor: string, 
  options?: BaseOptions<API.Factor, [string]>,
): BaseResult<API.Factor, [string]> => {
  const { client } = useBackendAPI();

  return useRequest<API.Factor>((factor: string) => client.get(GuardianEntity).getFactor(factor), {
    manual: false,
    defaultParams: [factor],
    formatResult: (data: API.Factor) => data,
    ...options,
  });
}

export const useFactorConfigs = (
  options?: BaseOptions<API.FactorConfig[], []>,
) => {
  const { client } = useBackendAPI();

  return useRequest(() => client.get(GuardianEntity).getFactorConfigs(), {
    manual: false,
    formatResult: (data: API.FactorConfig[]) => data,
    ...options,
  });
}

export const useFactorConfigDetails = (
  name: string, options?: BaseOptions<API.FactorConfig, [string]>,
): BaseResult<API.FactorConfig, [string]> => {
  const { client } = useBackendAPI();

  return useRequest((name: string) => client.get(GuardianEntity).getFactorConfig(name), {
    manual: false,
    defaultParams: [name],
    formatResult: (data: API.FactorConfig) => data,
    ...options,
  });
}

export const useFactorConfigUpdate = (
  options?: BaseOptions<API.FactorConfig, [string, Partial<API.FactorConfig>]>,
): BaseResult<API.FactorConfig, [string, Partial<API.FactorConfig>]> => {
  const { client } = useBackendAPI();

  return useRequest((name: string, data: Partial<API.FactorConfig>) => client.get(GuardianEntity).updateFactorConfig(name, data), {
    manual: true,
    formatResult: (data: API.FactorConfig) => data,
    ...options,
  });
}

export const useFactorProviders = (
  factor: string,
  options?: BaseOptions<API.FactorProvider[], []>,
) => {
  const { client } = useBackendAPI();

  return useRequest<API.FactorProvider[]>(
    (factor: string) => client.get(GuardianEntity).getFactorProviders(factor),
    {
      manual: false,
      defaultParams: [factor],
      formatResult: (data: API.FactorProvider[]) => data,
      ...options,
    },
  );
}


export const useFactorProvider = (
  factor: string,
  provider: string,
  options?: BaseOptions<API.FactorProvider, [string, string]>,
) => {
  const { client } = useBackendAPI();
  return useRequest<API.FactorProvider>(
    (factor: string, provider: string) => client.get(GuardianEntity).getFactorProvider(factor, provider), 
    {
      manual: false,
      defaultParams: [factor, provider],
      formatResult: (data: API.FactorProvider) => data,
      ...options,
    }
  );
}