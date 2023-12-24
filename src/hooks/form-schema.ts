import { BaseOptions } from '@ahooksjs/use-request/lib/types';
import { useRequest } from 'umi';
import { useEffect, useState } from "react";
import schemaMap from '../../config/schemas'; // 这里应该是通用的 schema 映射表
import { useBackendAPI } from "@/providers/backend-api/context";
import { FormSchemaEntity } from '@/api/entities/form-schema.entity';

export const useFormSchema = (namespace: string, name: string, options?: BaseOptions<Object, [string, string]>) => {
  const { client } = useBackendAPI();

  return useRequest((namespace: string, name: string) => client.get(FormSchemaEntity).get(namespace, name), {
    manual: false,
    defaultParams: [namespace, name],
    formatResult: (data: Object) => data,
    ...options,
  });
}

export const useFormSchemaCached = (namespace: string, name: string) => {
  const { run, loading, refresh } = useFormSchema(namespace, name, {
    manual: true,
  });

  const [schema, setSchema] = useState();
  useEffect(() => {
    let schema;
    const schemas = schemaMap[namespace];
    if (schemas) {
      schema = schemas[name];
    }

    if (schema) {
      setSchema(schema);
    } else {
      run(namespace, name).then((schema: Object) => setSchema(schema));
    }
  }, [namespace, name]);

  return { data: schema, loading: loading, refresh };
}