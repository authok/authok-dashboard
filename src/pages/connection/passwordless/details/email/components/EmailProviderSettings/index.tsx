import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFactorProviders } from '@/hooks/factor';
import { Switch, Form, Button, Row, Col, Divider, Card, Space, Spin } from 'antd';
import CheckCardSelect from '@/components/CheckCardSelect';
import ProForm, { ProFormText, ProFormDigit, ProFormSwitch, ProFormDependency } from '@ant-design/pro-form';
import { useForm } from 'antd/lib/form/Form';
import * as _ from 'lodash';
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import CodeEditor from '@/components/CodeEditor';
import SchemaField from '@/components/SchemaField';
import emailTemplate from './email.template';

interface EmailConnectionSettingsProps {
  connection: API.Connection;
  onUpdate?: (connection: API.Connection) => Promise<boolean>;
  loadingUpdate?: boolean;
}

const EmailConnectionSettings: React.FC<EmailConnectionSettingsProps> = ({ connection, onUpdate, loadingUpdate }) => {
  const { data: providerTemplates, loading: loadingProviders } = useFactorProviders('email');

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
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card bordered>
        <Row justify="center" align="middle">
          <Col style={{ flex: 1 }}>
            <h3>自定义邮件服务商</h3>
          </Col>
          <Col>
            <Switch loading={loadingUpdate} checked={connection.options?.enabled === true} onChange={(val) => handleUpdate({ options: { enabled: val } })}/>
          </Col>
        </Row>
      </Card>
      <Spin spinning={connection.options?.enabled !== true} indicator={<></>}>
        <Card bordered>
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
                email: {
                  syntax: 'liquid',
                  from: '{{ application.name }} <service@authok.cn>',
                  subject: '欢迎登录 {{ application.name }}',
                  body: emailTemplate,
                }
              }
            }}
            onFinish={handleUpdate}
            submitter={{
              render: (props, doms) => {
                return <Row>
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
            <ProFormText name={['options', 'email', 'from']} label={<b>发件人</b>} />
            <ProFormText name={['options', 'email', 'subject']} label={<b>主题</b>} />
            <ProForm.Item label={<b>内容</b>} name={['options', 'email', 'body']}>
              <CodeEditor
                language="html"
                height={500}
                options={{
                  minimap: {
                    enabled: false,
                  }
                }}
              />
            </ProForm.Item>
            <ProFormDigit label="验证码有效期" name={['options', 'otp', 'expiration']} fieldProps={{
              addonAfter: '秒'
            }}/>
            <ProFormDigit label="验证码长度" name={['options', 'otp', 'length']} fieldProps={{
              addonAfter: '位数字'
            }}/>
            <ProFormSwitch label="是否禁止注册" name={['options', 'disable_signup']}/>
          </ProForm>
        </Card>
      </Spin>
    </Space>
  );
}

export default EmailConnectionSettings;