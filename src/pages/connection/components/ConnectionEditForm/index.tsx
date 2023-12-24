import React, { useCallback, useMemo, useEffect } from 'react';
import { Card,  Divider, Spin, Typography } from 'antd';
import ProForm, { ProFormText, ProFormSwitch } from '@ant-design/pro-form';
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import * as _ from 'lodash';
import { useFormSchemaCached } from '@/hooks/form-schema';
import SchemaField from '@/components/SchemaField';
const { Text } = Typography;

interface ConnectionEditFormProps {
  strategy: string;
  connection?: API.Connection;
  onFinish?: (connection: API.Connection) => Promise<boolean>;
  scope?: Record<string, any>;
}

const ConnectionEditForm: React.FC<ConnectionEditFormProps> = ({ strategy, connection, onFinish, scope }) => {
  const { data: schema, loading: loadingSchema } = useFormSchemaCached('connections', strategy);

  const handleFinish = useCallback(async (data: Record<string, any>) => {
    dynamicForm.submit(async (data2) => {
      const { set_user_root_attributes, ...rest } = data2;
      const options = _.merge(data.options, rest);

      const connection = { ...data, options } as API.Connection;
      return onFinish?.(connection);
    });
  }, []);
  
  const dynamicForm = useMemo(() => createForm({
    validateFirst: true,
  }), []);

  useEffect(() => {
    if (connection) {
      dynamicForm.setValues(connection.options);
    }
  }, [connection])

  return (<Card style={{ width: '100%' }}>
    <Spin spinning={loadingSchema}>
      <ProForm
        initialValues={{ 
          ...(strategy === 'oauth2' ? undefined : { name: strategy } ),
          ...connection
        }}
        onFinish={handleFinish}
        size="large"
        submitter={{
          searchConfig: {
            submitText: !connection ? '创建' : '保存',
          },
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
      >
        <ProFormText
          label="唯一标识"
          name="name"
          disabled={!!connection}
          rules={[{ required: true, message: "此项为必填项"}]}
          fieldProps={{
            suffix: connection && <Text copyable={{ text: connection.name }}></Text>
          }}
          extra="身份源唯一标识，设置之后不能修改"
        />
        <ProFormText
          label="显示名称"
          name="display_name"
          extra={'如果设置，AuthOK 登录表单将会显示一个 "使用 {显示名称} 登录" 的按钮'}
        />
        <FormProvider form={dynamicForm}>
          <SchemaField schema={schema} scope={scope}/>
        </FormProvider>

        {
          !(['authok', 'sms', 'email'].includes(strategy)) && <>
            <Divider />
            <ProFormSwitch 
              label="每次登录都同步用户档案"
              name={["options", "set_user_root_attributes"]}
            />
          </>
        }
      </ProForm>
    </Spin>
  </Card>);
};

export default ConnectionEditForm;