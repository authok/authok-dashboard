import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Divider, Button } from 'antd';
import { CheckCard, CheckGroupValueType } from '@ant-design/pro-card';
import * as _ from 'lodash';
import { useConfigPagination, useConfigSet, useConfigDetails } from '@/hooks/config';
import { notification } from 'antd';
import { FormGrid, FormButtonGroup, Submit, FormItem, Input } from "@formily/antd";
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import ProviderCheckCard from './components/ProviderCheckCard';
import ProForm, { ProFormDependency } from '@ant-design/pro-form';
import { useForm } from 'antd/lib/form/Form';

interface PolicyCheckCardProps {
  value?: string;
  onChange?: (val: CheckGroupValueType) => void;
}

const PolicyCheckCard: React.FC<PolicyCheckCardProps> = ({ value, onChange }) => {
  return <CheckCard.Group style={{ width: '100%' }} value={value} onChange={onChange}>
    <CheckCard
      style={{ width: '100%' }}
      title="不需要" 
      description="登录不需要验证码"
      value="never" 
    />
    <CheckCard
      style={{ width: '100%' }}
      title="发生风险时" 
      description="如果登录存在风险"
      value="high_risk" 
    />
    <CheckCard
      style={{ width: '100%' }}
      title="总是需要"
      description="总是需要验证码"
      value="always" 
    />
  </CheckCard.Group>
};

export const SchemaField = createSchemaField({
  components: {
    Input,
    FormButtonGroup, 
    Submit, 
    FormItem, 
    PolicyCheckCard,
    ProviderCheckCard,
    FormGrid,
  }
});

const BotDetecionPage: React.FC = () => {
  const [dynamicForm, setDynamicForm] = useState(createForm({
    validateFirst: true,
  }));

  const { data: captchaProviders } = useConfigPagination<API.CatpchaProvider[]>({
    manual: false,
    defaultParams: [{
      namespace: 'captcha-provider',
      page_size: 100,
    }],
    formatResult: (page: API.Page<API.Config>) => page.items.map(it => it.value),
  });

  const { data: captchaConfig, refresh } = useConfigDetails('protection-config', 'captchas');
  const { run: setConfig } = useConfigSet();

  const captchaProviderMap = useMemo(() => _.keyBy(captchaProviders || [], 'name'), [captchaProviders]);

  const handleSaveConfig = useCallback(async (_config: API.Config) => {
    const enabled = !!_config.value && _config.value.policy !== 'never' || false;

    console.log('_config: ', _config);

    dynamicForm.submit(async (options) => {
      const config = {..._config, enabled};
      if (config.value && config.value.provider) {
        config.value = config.value || {};
        const providers = captchaConfig?.value?.providers || {};
        providers[config.value.provider] = options;

        config.value.providers = providers;
      }
      console.log('options: ', options);
      console.log('提交config: ', config)

      await setConfig('protection-config', 'captchas', config);
  
      notification.success({
        key: 'avatars.save',
        message: '保存成功',
      });
  
      refresh();
    });
  }, [captchaConfig, dynamicForm]);

  const [form] = useForm();

  useEffect(() => {
    if (!captchaConfig) return;

    form.setFieldsValue(captchaConfig);

    if (captchaConfig?.value?.provider) {
      const options = captchaConfig.value?.providers?.[captchaConfig?.value?.provider];
      if (options) {
        dynamicForm.setValues(options); 
      }
    }
  }, [captchaConfig]);

  const handleProviderChanged = useCallback((provider: string) => {
    const options = captchaConfig?.value?.providers?.[provider];
    const dynamicForm = createForm({
      validateFirst: true,
    })

    if (options) {
      dynamicForm.setValues(options); 
    }

    setDynamicForm(dynamicForm);
  }, [dynamicForm, captchaConfig]);

  return <PageContainer>
    <Card>
      <ProForm
        form={form}
        layout="vertical"
        size="large"
        onFinish={handleSaveConfig}
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
        <Row>
          <Col span={10}>
            <h3>强制开启验证码</h3>
          </Col>
          <Col span={14}>
            <ProForm.Item name={['value', 'policy']} title="是否需要开启验证码">
              <PolicyCheckCard />
            </ProForm.Item>
          </Col>
        </Row>
        <ProFormDependency name={[['value', 'policy']]}>
          {({ value }) => value && value.policy && value.policy !== 'never' && (
            <>
              <Divider />
              <Row>
                <Col span={10}>
                  <h3>选择验证码服务商</h3>
                </Col>
                <Col span={14}>
                  <ProForm.Item name={['value', 'provider']} title="是否需要开启验证码">
                    <ProviderCheckCard options={captchaProviders} onChange={handleProviderChanged}/>
                  </ProForm.Item>
                </Col>
              </Row>

              <ProFormDependency name={[['value', 'provider']]}>
                {({ value} ) => value && value.provider && (
                  <>
                   <Divider />
                   <Row>
                    <Col span={10}>
                      <h3>设置{captchaProviderMap[value.provider]?.title}</h3>
                    </Col>
                    <Col span={14}>
                      <FormProvider form={dynamicForm}>
                        { captchaProviderMap[value.provider] && <SchemaField schema={captchaProviderMap[value.provider].schema}  />}
                      </FormProvider>
                    </Col>
                  </Row>
                  </>
                )}
              </ProFormDependency>
            </>
          )}
        </ProFormDependency>
      </ProForm>
    </Card>
  </PageContainer>;
};

export default BotDetecionPage;