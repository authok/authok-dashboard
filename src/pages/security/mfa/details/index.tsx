import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useFactorDetails, useFactorConfigUpdate, useFactorConfigDetails, useFactorProviders } from '@/hooks/factor';
import { notification, Switch, Row, Col, Space, Tag, Card, Badge, Button, Divider } from 'antd';
import FactorIcon from '../components/FactorIcon';
import CheckCardSelect from '@/components/CheckCardSelect';
import ProForm, { ProFormDependency } from '@ant-design/pro-form';
import { useForm } from 'antd/lib/form/Form';
import * as _ from 'lodash';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { FormGrid, FormButtonGroup, Submit, FormItem, Input } from "@formily/antd";

export const SchemaField = createSchemaField({
  components: {
    Input,
    FormButtonGroup, 
    Submit, 
    FormItem, 
    FormGrid,
  }
});

const FactorDetails: React.FC<any> = ({ match }) => {
  const { factor } = match.params;
  const { data: factorTemplate } = useFactorDetails(factor);
  const { data: factorConfig, loading, refresh } = useFactorConfigDetails(factor);
  const { run: updateFactorConfig, loading: loadingUpdate } = useFactorConfigUpdate();
  const { data: providerTemplates, loading: loadingProviders } = useFactorProviders(factor);

  const name2provider = useMemo(() => _.keyBy(providerTemplates, 'name'), [providerTemplates]);

  const [enabled, setEnabled] = useState<boolean>(false);

  const [form] = useForm();

  const [dynamicForm, setDynamicForm] = useState(createForm({
    validateFirst: true,
  }));

  const handleProviderChanged = useCallback((provider: string | undefined) => {
    if (!provider) return;

    const dynamicForm = createForm({
      validateFirst: true,
    })
    
    const options = factorConfig?.value?.providers?.[provider];
    if (options) {
      dynamicForm.setValues(options); 
    }

    setDynamicForm(dynamicForm);
  }, [dynamicForm, factorConfig]);


  useEffect(() => {
    if (!loading) {
      setEnabled(factorConfig?.enabled || false);

      form.setFieldsValue(factorConfig?.value);

      if (factorConfig?.value?.provider) {
        const options = factorConfig.value?.providers?.[factorConfig?.value?.provider];
        if (options) {
          dynamicForm.setValues(options); 
        }
      }
    }
  }, [factorConfig, loading]);

  const handleEnabled = useCallback(async (enabled: boolean) => {
    await updateFactorConfig(factor, { enabled });

    setEnabled(enabled);

    if (enabled) {
      notification.success({
        key: `${factor}.set`,
        message: `${factorTemplate?.title}已开启`,
      });
    } else {
      notification.success({
        key: `${factor}.set`,
        message: `${factorTemplate?.title}}已关闭`,
      });
    }
  }, [factorTemplate, factorConfig]);

  const handleUpdate = useCallback(async (_value: Record<string, any>) => {
    const enabled = !!_value && !!_value.provider || false;

    dynamicForm.submit(async (_value2) => {
      const config = { enabled } as API.FactorConfig;

      if (_value.provider) {
        const providers = {};
        providers[_value.provider] = _value2;
  
        config.value = _.merge(factorConfig?.value || {}, _value, { provider: _value.provider, providers } );
      }

      await updateFactorConfig(factor, config);
  
      notification.success({
        key: `${factor}.set`,
        message: `设置成功`,
      });
  
      refresh();
    });
  }, [dynamicForm, factorTemplate, factorConfig]);

  return <PageContainer>
    <Card bordered={false}>
      <Space direction="vertical" style={{ width: '100% '}} size="middle">
        <Row align="middle" gutter={16} style={{ marginTop: 16 }}>
          <Col span={20}>
            <Space direction="horizontal" align="center" size="middle">
              <FactorIcon factor={factor} />
              <span style={{ fontSize: '27px' }}><b>{factorTemplate?.title}</b></span>
              {enabled ? <Tag color="default"><Badge status="success" text="已开启" /></Tag> : (!loading && <Tag color="default"><Badge color="gray" text="已关闭" /></Tag>)}
            </Space>
          </Col>
          <Col span={4}>
            <Row justify="end" align="middle">
              <Switch checked={enabled} onChange={handleEnabled} loading={loadingUpdate}/>
            </Row>
          </Col>
        </Row>
        <Row>
          <p>{factorTemplate?.description}</p>
        </Row>

        <Card>
          <ProForm
            form={form}
            size="large"
            onFinish={handleUpdate}
            initialValues={{
              threshold_type: 'default',
              'pre-login': {
                max_attempts: 100,
                rate: 100,
              },
              'pre-registration': {
                max_attempts: 50, 
                rate: 3,
              }
            }}
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
            <ProForm.Item name="provider" label="请选择一个服务提供商">
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
            <Divider />
            <ProFormDependency name={['provider']}>
              {({ provider } ) => provider && (
                <>
                  <Divider />
                  <Row>
                  <Col span={10}>
                    <h3>设置{name2provider[provider]?.title}</h3>
                  </Col>
                  <Col span={14}>
                    <FormProvider form={dynamicForm}>
                      { name2provider[provider] && <SchemaField schema={name2provider[provider].schema}  />}
                    </FormProvider>
                  </Col>
                </Row>
                </>
              )}
            </ProFormDependency>
          </ProForm>
        </Card>
      </Space>
    </Card>
  </PageContainer>;
}

export default FactorDetails;