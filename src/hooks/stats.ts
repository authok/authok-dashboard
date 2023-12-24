import { StatsEntity } from "@/api/entities/stats.entity";
import { BaseOptions } from '@ahooksjs/use-request/lib/types';
import { useBackendAPI } from "@/providers/backend-api/context";
import { useRequest } from "@umijs/hooks";

export const useStats = (
  options?: BaseOptions<any, [string]>,
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (key: string, query: Record<string, any>) => client.get(StatsEntity).fetch(key, query),
    {
      manual: false,
      formatResult: (data: any) => data,
      ...options,
    }
  );
};