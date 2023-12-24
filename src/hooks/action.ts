import { BaseOptions, OptionsWithFormat } from '@ahooksjs/use-request/lib/types';

import { useRequest } from 'umi';
import { useBackendAPI } from '@/providers/backend-api/context';
import { ActionEntity } from '@/api';



export const useTriggerBindings = <U = any, UU extends U = any>(
    trigger_id: string,
    options?: OptionsWithFormat<API.Page<API.TriggerBinding>, [string], U, UU>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (trigger_id: string) => client.get(ActionEntity).listTriggerBindings(trigger_id), 
    {
      manual: false,
      defaultParams: [trigger_id],
      formatResult: (data: API.Page<API.TriggerBinding>) => data,
      ...options,
    } as any,
  );
}

export const useTriggerBindingsUpdate = (
  options?: BaseOptions<API.TriggerBinding[], [string, API.BindingsUpdateRequest]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (trigger_id: string, req: API.BindingsUpdateRequest) => client.get(ActionEntity).updateTriggerBindings(trigger_id, req),
    {
      manual: true,
      formatResult: (data: API.TriggerBinding[]) => data,
      ...options,
    },
  );
}

export const useActionTest = (
  options?: BaseOptions<any, [string, API.TriggerEvent]>
) => {
  const { client } = useBackendAPI();

  return useRequest(
    (actionId: string, event: API.TriggerEvent) => client.get(ActionEntity).test(actionId, event),
    {
      manual: true,
      formatResult: (data: API.TriggerEvent[]) => data,
      ...options,
    },
  );
}
