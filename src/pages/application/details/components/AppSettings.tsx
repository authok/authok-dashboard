import React, { useEffect, useRef, useMemo } from 'react';
import { Tabs, Card, Row, Col, Divider, Typography, Space, Button } from 'antd';
import ProForm, { ProFormDigit, ProFormDependency, ProFormSwitch, ProFormList, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import styles from './index.less';
import * as _ from 'lodash';
import DeviceSettings from './DeviceSettings';
import OAuthSettings from './OAuthSettings';
import GrantTypeSettings from './GrantTypeSettings';
import WSFederationSettings from './WSFederationSettings';
import CertificateSettings from './CertificateSettings';
import Endpoints from './Endpoints';
import { useForm } from 'antd/lib/form/Form';
import DangerItem from '@/components/DangerItem';
import KeywordConfirmModal from '@/components/KeywordConfirmModal';
import LogoInput from '@/components/LogoInput';
import MetadataEditor from '@/components/MetadataEditor';
import { useTenantDetails } from '@/hooks/tenant';
const { Paragraph, Text } = Typography;

interface AppSettingsProps {
  application: API.Application;
  onUpdate: (application: Partial<API.Application>) => void;
  onDelete: (id: string) => boolean;
  loadingDelete: boolean;
}

const AppSettings: React.FC<AppSettingsProps> = ({ application, onUpdate, onDelete, loadingDelete }) => {
  const { data: tenantSettings } = useTenantDetails();

  const handleFinish = async (values: any) => {
    let mobile = values.mobile;
    if (values.mobile && values.mobile.android) {
      const sha256_cert_fingerprints = values.mobile.android?.sha256_cert_fingerprints?.split(',');
      mobile = {...values.mobile};
      mobile.android.sha256_cert_fingerprints = sha256_cert_fingerprints;
    }

    const newValues = {
      ...values,
      redirect_uris:  values.redirect_uris?.map((it: any) => it.uri),
      allowed_logout_urls: values.allowed_logout_urls?.map((it: any) => it.uri),
      web_origins: values.web_origins?.map((it: any) => it.uri),
      allowed_origins: values.allowed_origins?.map((it: any) => it.uri),
      ...(mobile && { mobile }),
    }

    return await onUpdate(newValues);
  }

  const clientSecretRef = useRef();

  useEffect(() => {
    clientSecretRef.current.input.disabled = true;
  }, []);

  const redirect_uris = application.redirect_uris?.map((uri) => ({ uri }));
  const allowed_logout_urls = application.allowed_logout_urls?.map((uri) => ({ uri }));
  const web_origins = application.web_origins?.map((uri) => ({ uri }));
  const allowed_origins = application.allowed_origins?.map((uri) => ({ uri }));

  const mobile = useMemo(() =>{
    let mobile = undefined;
    if (application && application.mobile && application.mobile.android) {
      const sha256_cert_fingerprints = application.mobile.android.sha256_cert_fingerprints?.join(',') || undefined;
      if (sha256_cert_fingerprints) {
        mobile = {...application.mobile};
        mobile.android.sha256_cert_fingerprints = sha256_cert_fingerprints;
      }
    }
    return mobile;
  }, [application])

  const [form] = useForm();

  return (<>
    <Card>
      <ProForm 
        form={form}
        className={styles['authok-application-form']} 
        initialValues={{ ...application, redirect_uris, allowed_logout_urls, web_origins, allowed_origins, mobile }} 
        onFinish={handleFinish}
        autoFocusFirstInput={false}
        size="large"
        submitter={{
          render: (props, doms) => {
            return <Row justify="center">
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                保存设置
              </Button>
            </Row>;
          },
        }}
      >
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{formatMessage({ id: 'app.settings.application.basic_info' })}</h3></Col>
          <Col span={16}>
            <ProFormText
              name="name"
              width="xl"
              required
              label="应用名称"
              tooltip="最长 32 位"
              placeholder="请输入名称"
              fieldProps={{
                suffix: (<Text copyable={{ text: form.getFieldValue('name')}} />),
              }}
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText
              label="域名"
              width="xl"
              disabled
              placeholder=""
              value={tenantSettings?.domain}
              fieldProps={{
                suffix: (<Text copyable={{ text: tenantSettings?.domain}} />),
              }}
            />
            <ProFormText
              label="Client ID"
              width="xl"
              value={application.client_id}
              disabled
              fieldProps={{
                suffix: (<Text copyable={{ text: application.client_id}} />),
              }}
            />
            <ProFormText.Password
              label="Client Secret"
              width="xl"
              value={application.client_secret}
              fieldProps={{
                ref: clientSecretRef,
                iconRender: (visible: boolean) => {
                  const eyeIcon = visible ? <EyeOutlined /> : <EyeInvisibleOutlined />;
                  return (
                    <Space direction="horizontal">
                      <Space style={{ marginRight: '4px' }}>
                        {eyeIcon}
                      </Space>
                      <Text copyable={{ text: application.client_secret }} />
                    </Space>
                  );
                },
              }}
            />
            <ProFormTextArea
              name="description"
              label={formatMessage({ id: 'app.settings.application.description' })}
              width="xl"
              fieldProps={{
                rows: 5,
              }}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{formatMessage({ id: 'app.settings.application.properties' })}</h3></Col>
          <Col span={16}>
            <ProForm.Item name="logo_uri">
              <LogoInput />
            </ProForm.Item>
            <ProFormSelect
              width="xl"
              disabled={application.app_type === 'non_interactive'}
              onChange={(app_type) => {
                if (app_type === 'spa' || app_type === 'native') {
                  form.setFieldsValue({
                    token_endpoint_auth_method: 'none'
                  });
                }
              }}
              name="app_type"
              label={formatMessage({ id: 'app.settings.application.app_type' })}          
              options={[
                {
                  label: '原生应用',
                  value: 'native',
                },
                {
                  label: '单页应用(SPA)',
                  value: 'spa',
                },
                {
                  label: 'WEB应用',
                  value: 'web',
                },
                {
                  label: '机器对机器',
                  value: 'non_interactive',
                },
              ]}
            />
            <ProFormDependency name={['app_type']}>
              {({ app_type}) => {
                let options = [
                  {
                    label: 'Basic',
                    value: 'client_secret_basic',
                  },
                  {
                    label: 'Post',
                    value: 'client_secret_post',
                  },
                  {
                    label: 'None',
                    value: 'none',
                  },            
                ];

                switch (app_type) {
                  case 'non_interactive': {
                    break;
                  }
                  case 'web': {
                    break;
                  }
                  case 'spa': {
                    options = [options[2]];
                    break;
                  }
                  case 'native': {
                    options = [options[2]];
                    break;
                  }
                }

                return <ProFormSelect
                  width="xl"
                  disabled={app_type === 'spa' || app_type === 'native'}
                  name="token_endpoint_auth_method"
                  label={formatMessage({ id: 'app.settings.application.token_endpoint_auth_method' })}
                  options={options}
                />;
              }}
            </ProFormDependency>
            <ProFormSwitch name="is_first_party" label="是否第一方应用" extra="第一方应用不会弹出授权"/>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{formatMessage({ id: 'app.settings.application.uris' })}</h3></Col>
          <Col span={16}>
            <ProFormText
              name="initiate_login_uri"
              label={formatMessage({ id: 'app.settings.application.initiate_login_uri' })}
              width="xl"
              placeholder="https://myapp.com/login"
            />
            <ProFormList
              name="redirect_uris"
              label={formatMessage({ id: 'app.settings.application.redirect_uris' })}
              creatorButtonProps={{
                position: 'bottom',
                creatorButtonText: '添加',
              }}
              copyIconProps={false}
            >
              <ProFormText
                name="uri"
                required
                rules={[{ required: true, message: '不能为空' }]}
                width="xl"            
              />
            </ProFormList>
            <ProFormList
              name="allowed_logout_urls"
              label={formatMessage({ id: 'app.settings.application.allowed_logout_urls' })}
              creatorButtonProps={{
                position: 'bottom',
                creatorButtonText: '添加',
              }}
              copyIconProps={false}
            >
              <ProFormText
                name="uri"
                required
                rules={[{ required: true, message: '不能为空' }]}
                width="xl"
              />
            </ProFormList>
            <ProFormList
              name="web_origins"
              label={formatMessage({ id: 'app.settings.application.web_origins' })}
              creatorButtonProps={{
                position: 'bottom',
                creatorButtonText: '添加',
              }}
              copyIconProps={false}
            >
              <ProFormText
                name="uri"
                required
                rules={[{ required: true, message: '不能为空' }]}
                width="xl"
              />
            </ProFormList>
            <ProFormList
              name="allowed_origins"
              label={formatMessage({ id: 'app.settings.application.allowed_origins' })}
              creatorButtonProps={{
                position: 'bottom',
                creatorButtonText: '添加',
              }}
              copyIconProps={false}
            >
              <ProFormText
                name="uri"
                required
                rules={[{ required: true, message: '不能为空' }]}
                width="xl"
              />
            </ProFormList>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{"ID Token"}</h3></Col>
          <Col span={16}>
            <ProFormDigit
              width="xl"
              name={["jwt_configuration", "lifetime_in_seconds"]}
              fieldProps={{
                addonAfter: '秒'
              }}
            />
          </Col>
        </Row>
        <Divider/>
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{"Refresh Token Rotation"}</h3></Col>
          <Col span={16}>
            <ProFormSwitch
              label="Absolute 超时"
              name={['refresh_token', 'infinite_token_lifetime']}
            />
            <ProFormDigit
              width="xl"
              name={["refresh_token", "token_lifetime"]}
              label="Absolute Lifetime"
              fieldProps={{
                addonAfter: '秒',
              }}
            />
            <ProFormSwitch
              label="Inactivity Expiration"
              name={['refresh_token', 'infinite_idle_token_lifetime']}
            />
            <ProFormDigit
              width="xl"
              label="Inactivity Lifetime"
              name={["refresh_token", "idle_token_lifetime"]}
              fieldProps={{
                addonAfter: '秒',
              }}
            />
          </Col>
        </Row>
        <ProCard style={{ marginBottom: '16px' }} title="高级设置" collapsible={true} defaultCollapsed bordered>
          <Tabs>
            <Tabs.TabPane tab="应用元数据" key="metadata">
              <ProForm.Item name="client_metadata">
                <MetadataEditor />
              </ProForm.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="设备设置" key="device_settings">
              <DeviceSettings />
            </Tabs.TabPane>
            <Tabs.TabPane tab="OAuth" key="oauth">
              <OAuthSettings />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Grant Types" key="grant_types">
              <GrantTypeSettings />
            </Tabs.TabPane>
            <Tabs.TabPane tab="WS-Federation" key="ws-federation">
              <WSFederationSettings />
            </Tabs.TabPane>
            <Tabs.TabPane tab="证书" key="certificates">
              <CertificateSettings signingKey={_.first(application.signing_keys) || { cert: 'cert', pkcs8: 'pkcs8', subject: 'subject' }}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="端点" key="endpoints">
              <Endpoints />
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
      </ProForm>
    </Card>
    <h2 style={{ marginTop: '24px' }}>危险操作</h2>
    <Space direction="vertical" style={{ width: '100%'}}>
      <DangerItem 
        title="删除应用" 
        description="操作无法撤销" 
        actions={[
          <KeywordConfirmModal 
            title="您确定要删除当前应用吗?"
            description={<>
              <Paragraph>
                此操作不可恢复. 将会永久删除 <b>{application.name}</b>
              </Paragraph>
              <Paragraph>请输入应用的名字进行确认.</Paragraph>          
            </>}
            onOk={() => onDelete(application.client_id)}
            onCancel={() => console.log('onCancel')}
            keyword={application.name}
            trigger={<Button loading={loadingDelete} type="primary" danger size="large">删除</Button>}
          />
        ]}
      />
    </Space>
  </>);
};

export default AppSettings;