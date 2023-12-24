import React, { useMemo, useState } from 'react';
import { Descriptions, Radio, Card, Row, Col, Button, Space, Typography, Tag } from 'antd';
import { FileDoneOutlined, MailOutlined, LinkOutlined, CodeFilled, BuildFilled, CheckSquareFilled } from '@ant-design/icons';
import ProForm, { ProFormDependency, ProFormCheckbox, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import LogoInput from '@/components/LogoInput';
import EnvironmentSelect from '@/components/EnvironmentSelect';
import * as _ from 'lodash';
const { Text } = Typography;

// TODO 要移动到配置目录
import languageOptions from '@/../config/language.options';
import { useForm } from 'antd/lib/form/Form';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';


interface GeneralSettingsProps {
  tenant: API.Tenant;
  onUpdate: (data: Partial<API.Tenant>) => Promise<boolean>;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ tenant, onUpdate }) => {
  const { data: connections, loading: loadingConnections } = useResourcePagination(ConnectionEntity, {
    manual: false,
    defaultParams: [{
      strategy: ['authok', 'sms', 'email'],
    }],
    formatResult: (page: API.Page<API.Connection>) => page.items,
  });

  const connectionOptions = useMemo(() => connections?.map(it => ({ label: it.name, value: it.name })), [connections]);
  
  const handleUpdate = (data: Record<string, any>) => {
    const { custom_error_page, error_page, ...rest} = data;
    let _error_page = error_page;
    if (!custom_error_page) {
      _error_page = {};
    }

    return onUpdate({...rest, error_page: _error_page});
  }

  const [localeForm] = useForm();


  const [defaultLocale, setDefaultLocale] = useState<string>(tenant?.enabled_locales?.[0] || '');

  const handleSelectDefaultLocale = (defaultLocale: string) => {
    setDefaultLocale(defaultLocale);

    const _enabled_locales = localeForm.getFieldValue('enabled_locales') || [];
    
    const s = new Set(_enabled_locales);
    s.delete(defaultLocale);

    const enabled_locales = [ defaultLocale, ...Array.from(s)];

    localeForm.setFieldsValue({
      enabled_locales,
    });
  }

  const localeOptions = useMemo(() => languageOptions.map(it => ({...it, disabled: it.value === defaultLocale })), [defaultLocale]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="租户信息" extra={<Button size="large" icon={<FileDoneOutlined />}>完备性检查</Button>}>
        <Descriptions column={2}>
          <Descriptions.Item label={<b>名称</b>}>{tenant.name}</Descriptions.Item>
          <Descriptions.Item label={<b>区域</b>}>{tenant.region}</Descriptions.Item>
          <Descriptions.Item label={<b>域名</b>}>
            <Text copyable>{tenant.domain}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={<b>环境</b>}>
            <Space>
              {tenant.environment === 'staging' && <CodeFilled/> }
              {tenant.environment === 'developing' && <BuildFilled/> }
              {tenant.environment === 'production' && <CheckSquareFilled/> }
              <Tag>{tenant.environment}</Tag>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>设置</h3></Col>
          <Col span={16}>
            <ProForm 
              initialValues={tenant} 
              onFinish={onUpdate}
              autoFocusFirstInput={false}
              size="large"
              submitter={{
                searchConfig: {
                  submitText: '保存',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
              }}
            >
              <ProFormText label={<b>显示名称</b>} name="friendly_name"/>
              <ProForm.Item label={<b>图标URL</b>} name="picture_url">
                <LogoInput />
              </ProForm.Item>
              <ProFormText label={<b>技术支持email</b>} name="support_email" fieldProps={{
                addonBefore: <MailOutlined />,
              }}/>
              <ProFormText label={<b>技术支持网址</b>} name="support_url" fieldProps={{
                addonBefore: <LinkOutlined />,
              }}/>
            </ProForm>
          </Col>
        </Row>        
      </Card>
      <Card>
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>运行环境</h3></Col>
          <Col span={16}>
            <ProForm 
              initialValues={tenant} 
              onFinish={onUpdate}
              autoFocusFirstInput={false}
              size="large"
              submitter={{
                searchConfig: {
                  submitText: '保存',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
              }}
            >
              <ProForm.Item name="environment" required>       
                <EnvironmentSelect />
              </ProForm.Item>
            </ProForm>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>API授权设置</h3></Col>
          <Col span={16}>
            <ProForm 
              initialValues={tenant}
              onFinish={onUpdate}
              autoFocusFirstInput={false}
              size="large"
              submitter={{
                searchConfig: {
                  submitText: '保存',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
              }}
            >
              <ProFormSelect 
                name="default_connection"
                label={<b>密码授权默认身份源</b>}
                loading={loadingConnections}
                options={connectionOptions} 
                placeholder="请选择连接"
                extra="用于密码授权流程的默认连接. 只允许采用如下策略的连接: ad, authok, email, sms, waad, adfs"
              />
            </ProForm>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>错误页面</h3></Col>
          <Col span={16}>
            <ProForm 
              initialValues={{...tenant, custom_error_page: !_.isEmpty(tenant.error_page) }} 
              onFinish={handleUpdate}
              autoFocusFirstInput={false}
              size="large"
              submitter={{
                searchConfig: {
                  submitText: '保存',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
              }}
            >
              <ProForm.Item label={<b>默认错误页面</b>} name="custom_error_page">
                <Radio.Group optionType="button" buttonStyle="solid">
                  <Radio.Button value={false}>通用设置</Radio.Button>
                  <Radio.Button value={true}>自定义页面</Radio.Button>
                </Radio.Group>
              </ProForm.Item>
              <ProFormDependency name={['custom_error_page']}>
                {({ custom_error_page }) => 
                  custom_error_page && <ProFormText 
                    name={['error_page', 'url']} 
                    label="自定义错误页面URL"
                    placeholder="https://mydomain/error"
                    rules={[{ required: true, message: '必须是合法链接' }]}
                    fieldProps={{
                      addonBefore: <LinkOutlined/>,
                    }}
                  />
                }
              </ProFormDependency>
            </ProForm>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>语言设置</h3></Col>
          <Col span={16}>
            <ProForm 
              form={localeForm}
              initialValues={tenant} 
              onFinish={onUpdate}
              autoFocusFirstInput={false}
              size="large"
              submitter={{
                searchConfig: {
                  submitText: '保存',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
              }}
            >
              <ProFormSelect 
                label={<b>默认语言</b>} 
                placeholder="请选择"
                options={languageOptions}
                value={defaultLocale} 
                onChange={handleSelectDefaultLocale}
              />            
              <ProFormCheckbox.Group label={<b>支持的语言</b>} name="enabled_locales">
                {localeOptions.map((option, i) => <div key={i} style={{ width: 200, display: 'inline-block' }}><Checkbox value={option.value} disabled={option.disabled}>{option.label}</Checkbox></div>)}
              </ProFormCheckbox.Group>
            </ProForm>
          </Col>
        </Row>
      </Card>
    </Space>
  );
  
};

export default GeneralSettings;