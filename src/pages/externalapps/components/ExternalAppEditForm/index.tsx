import React, { useCallback, useMemo, useEffect } from 'react';
import { Card,  Spin } from 'antd';
import ProForm from '@ant-design/pro-form';
import { createForm, onFormSubmit } from '@formily/core';
import { FormProvider } from '@formily/react';
import * as _ from 'lodash';
import { useFormSchemaCached } from '@/hooks/form-schema';
import SchemaField from '@/components/SchemaField';

interface ExternalAppEditFormProps {
  schemaNamespace: string;
  schemaKey: string;
  application?: API.Application;
  onFinish?: (application: Partial<API.Application>) => Promise<boolean>;
  scope?: Record<string, any>;
}

const ExternalAppEditForm: React.FC<ExternalAppEditFormProps> = ({ schemaNamespace, schemaKey, application, onFinish, scope }) => {
  const dynamicForm = useMemo(() => createForm({
    validateFirst: true,
    /*effects() {
      onFormSubmit((form) => {
        console.log('onFormSubmit: ', form.values);
      })
    },*/
  }), []);

  const { data: schema, loading: loadingSchema } = useFormSchemaCached(schemaNamespace, schemaKey);

  const handleFinish = useCallback(async (data: Record<string, any>) => {
    dynamicForm.submit(async (data2) => {
      const application = _.merge(data, data2);

      // TODO 这里权宜之计，理论上只能更改 schema定义的字段
      const toUpdate = _.pick(application, 'addons', 'name', 'redirect_uris', 'app_type', 'is_first_party');

      return onFinish?.(toUpdate);
    });
  }, []);
  
  useEffect(() => {
    if (application) {
      dynamicForm.setValues(application);
    }
  }, [application])

  return (<Card style={{ width: '100%' }}>
    <Spin spinning={loadingSchema}>
      <ProForm
        initialValues={application}
        onFinish={handleFinish}
        size="large"
        submitter={{
          searchConfig: {
            submitText: !application ? '创建' : '保存',
          },
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
      >
        <FormProvider form={dynamicForm}>
          <SchemaField schema={schema} scope={scope}/>
        </FormProvider>
      </ProForm>
    </Spin>
  </Card>);
};

export default ExternalAppEditForm;