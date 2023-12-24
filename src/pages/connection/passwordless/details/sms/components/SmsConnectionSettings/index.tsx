import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFactorProviders } from '@/hooks/factor';
import { Button, Row, Col, Divider } from 'antd';
import CheckCardSelect from '@/components/CheckCardSelect';
import ProForm, { ProFormText, ProFormDigit, ProFormDependency } from '@ant-design/pro-form';
import { useForm } from 'antd/lib/form/Form';
import * as _ from 'lodash';
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import CodeEditor from '@/components/CodeEditor';
import SchemaField from '@/components/SchemaField';

interface SmsConnectionSettingsProps {
  connection: API.Connection;
  onUpdate?: (connection: API.Connection) => Promise<boolean>;
}

const SmsConnectionSettings: React.FC<SmsConnectionSettingsProps> = ({ connection, onUpdate }) => {
  const { data: providerTemplates, loading: loadingProviders } = useFactorProviders('sms');

  const name2provider = useMemo(() => _.keyBy(providerTemplates, 'name'), [providerTemplates]);

  const [form] = useForm();

  const [dynamicForm, setDynamicForm] = useState(createForm({
    validateFirst: true,
  }));

  const handleProviderChanged = useCallback((provider: string | undefined) => {
    if (!provider) return;

    const dynamicForm = createForm({
      validateFirst: true,
    })

    const options = connection?.options?.providers?.[provider];
    if (options) {
      dynamicForm.setValues(options); 
    }

    setDynamicForm(dynamicForm);
  }, [dynamicForm, connection]);

  useEffect(() => {
    if (connection) {
      form.setFieldsValue(connection);

      if (connection.options && connection.options.provider) {
        const options = connection.options.providers?.[connection.options.provider];
        if (options) {
          dynamicForm.setValues(options); 
        }
      }
    }
  }, [connection]);

  const handleUpdate = useCallback(async (_value: API.Connection) => {
    dynamicForm.submit(async (_options) => {
      const value = {..._value};

      if (value.options && value.options.provider) {
        const providers = {};
        providers[value.options.provider] = _options;

        value.options = _.merge(connection.options || {}, _value.options, { providers });
      }

      await onUpdate?.(value);
    });
  }, [dynamicForm, connection]);

  return (
    <ProForm<API.Connection>
      form={form}
      size="large"
      initialValues={{
        options: {
          template: '你的验证码是: @@code@@',
          otp: {
            expiration: 180,
            length: 6,
          },
        }
      }}
      onFinish={handleUpdate}
      submitter={{
        render: (props, doms) => {
          return <Row>
            <Col span={10}></Col>
            <Col span={14}>
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>保存</Button>
            </Col>
          </Row>;
        }
      }}
    >
      <ProFormText
        label={<b>唯一标识</b>}
        name="name"
        disabled={true}
        rules={[{ required: true, message: "此项为必填项"}]}
        extra="" 
      />
      <ProForm.Item name={['options', 'provider']} label={<b>请选择一个服务提供商</b>}>
        <CheckCardSelect
          cardStyle={{ width: '314px' }} 
          options={providerTemplates?.map(it => ({
            title: it.title,
            description: it.description,
            value: it.name,
          }))}
          loading={loadingProviders}
          onChange={handleProviderChanged}
        />
      </ProForm.Item>
      <ProFormDependency name={[['options', 'provider']]}>
        {({ options } ) => options.provider && (
          <>
            <Divider />
            <Row>
            <Col span={10}>
              <h3>设置{name2provider[options.provider]?.title}</h3>
            </Col>
            <Col span={14}>
              <FormProvider form={dynamicForm}>
                { name2provider[options.provider] && <SchemaField schema={name2provider[options.provider].schema}  />}
              </FormProvider>
            </Col>
          </Row>
          </>
        )}
      </ProFormDependency>
      <ProForm.Item label={<b>消息模版</b>} name={['options', 'template']}>
        <CodeEditor
          language="liquid"
          height={200}
        />
      </ProForm.Item>
      <ProFormDigit label="验证码有效期" name={['options', 'otp', 'expiration']} fieldProps={{
        addonAfter: '秒'
      }}/>
      <ProFormDigit label="验证码长度" name={['options', 'otp', 'length']} fieldProps={{
        addonAfter: '位数字'
      }}/>
    </ProForm>
  );
}

export default SmsConnectionSettings;