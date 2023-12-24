import React from 'react';
import { Card, Row, Col, Divider, Typography, Button } from 'antd';
import ProForm, { ProFormDependency, ProFormSwitch, ProFormDigit, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { formatMessage } from 'umi';
import * as _ from 'lodash';
import DangerItem from '@/components/DangerItem';
import KeywordConfirmModal from '@/components/KeywordConfirmModal';
const { Text, Paragraph } = Typography;

interface ResourceServerSettingsProps {
  resourceServer: API.ResourceServer;
  onUpdate: (application: Partial<API.ResourceServer>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const ResourceServerSettings: React.FC<ResourceServerSettingsProps> = ({ resourceServer, onUpdate, onDelete }) => {
  const handleFinish = async (values: any) => {    
    const newValues = {
      ...values,
      redirect_uris:  values.redirect_uris?.map((it: any) => it.uri),
      allowed_logout_urls: values.allowed_logout_urls?.map((it: any) => it.uri),
      web_origins: values.web_origins?.map((it: any) => it.uri),
      allowed_origins: values.allowed_origins?.map((it: any) => it.uri),
    }

    return await onUpdate(newValues);
  }

  return (<>
    <Card>
      <ProForm 
        initialValues={resourceServer} 
        onFinish={handleFinish}
        autoFocusFirstInput={false}
        size="large"
        submitter={{
          searchConfig: {
            submitText: '保存设置',
          },
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
      >
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{formatMessage({ id: 'app.settings.resource_server.basic_info' })}</h3></Col>
          <Col span={16}>
            <ProFormText
              label="id"
              width="xl"
              disabled
              placeholder=""
              value={resourceServer.id}
            />
            <ProFormText
              name="name"
              width="xl"
              required
              label="名称"
              tooltip="最长 32 位"
              placeholder="请输入名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText
              label="Identifier"
              width="xl"
              value={resourceServer.identifier}
              disabled
              fieldProps={{
                suffix: <Text copyable />
              }}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{formatMessage({ id: 'app.settings.resource_server.token' })}</h3></Col>
          <Col span={16}>
            <ProFormDigit
              width="xl"
              name="token_lifetime"
              label="令牌超时时间(秒)"
              fieldProps={{
                defaultValue: 86400,
                suffix: '秒'
              }}
            />
            <ProFormDigit
              width="xl"
              name="token_lifetime_for_web"
              label="浏览器令牌超时时间(秒)"
              fieldProps={{
                defaultValue: 7200,
                suffix: '秒'
              }}
            />
            <ProFormSelect
              width="xl"
              name="signing_alg"
              label="签名算法"
              options={[
                {
                  label: 'RS256',
                  value: 'RS256',
                },
                {
                  label: 'HS256',
                  value: 'HS256',
                },
              ]}
            />
          </Col>
        </Row>
        <Divider/>
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{"RBAC权限设置"}</h3></Col>
          <Col span={16}>
            <ProFormSwitch
              label="开启RBAC"
              name="enforce_policies"
            />
            <ProFormDependency name={['enforce_policies']}>
              {({ enforce_policies }) => <ProFormSwitch disabled={!enforce_policies} label="是否把权限加入访问令牌" />}
            </ProFormDependency>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col span={8}><h3>{"访问设置"}</h3></Col>
          <Col span={16}>
            <ProFormSwitch
              label="允许跳过用户授权"
              name="skip_consent_for_verifiable_first_party_clients"
            />
            <ProFormSwitch
              label="允许离线访问"
              name="allow_offline_access"
            />
          </Col>
        </Row>
      </ProForm>
    </Card>
    <h2 style={{ marginTop: '24px' }}>危险操作</h2>
    <DangerItem title="删除API" description="操作无法撤销" actions={[
      <KeywordConfirmModal 
        title="您确定要删除当前API吗?"
        description={<>
          <Paragraph>
            此操作不可恢复. 将会永久删除API <b>{resourceServer.name}</b>
          </Paragraph>
          <Paragraph>请输入API的名字进行确认.</Paragraph>          
        </>}
        onOk={() => onDelete(resourceServer.id)}
        onCancel={() => console.log('onCancel')}
        keyword={resourceServer.name}
        trigger={<Button type="primary" danger size="large">删除</Button>}
      />
    ]}/>
  </>);
};

export default ResourceServerSettings;