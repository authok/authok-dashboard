import React from 'react';
import { Row, Col, Space, Card, Divider, Button } from 'antd';
import ProForm, { ProFormText, ProFormDependency } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import ColorInput from '@/components/ColorInput';
import * as _ from 'lodash';
import { LoginPreview } from '../LoginPreview';
import MetadataEditor from '@/components/MetadataEditor';
import DangerItem from '@/components/DangerItem';
import KeywordConfirmModal from '@/components/KeywordConfirmModal';

interface OrganizationSettingsProps {
  organization: API.Organization;
  onUpdate: (organization: API.Organization) => Promise<boolean>;
  onDelete: (id: string) => void;
}

const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ organization, onUpdate, onDelete }) => {
  const branding = _.merge({
    colors: {
      primary: '#69c0ff',
      page_background: '#000',
    }
  }, organization.branding);

  return <Space direction="vertical" style={{ width: '100%' }}>
    <Card>
      <ProForm 
        initialValues={{
          ...organization,
          branding,
        }} 
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
        <Row gutter={[16, 16]} justify="center">
          <Col span={10}><h3>基本信息</h3></Col>
          <Col span={14}>
            <ProFormText
              label="组织标识符"
              name="name"
              width="xl"
              required
              tooltip="最长 24 位"
              placeholder="请输入名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText
              label="名称"
              name="display_name"
              width="xl"
              placeholder=""
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col span={10}>
            <h3>品牌化</h3>
            <ProForm.Item label="主色" name={['branding', 'colors', 'primary']}>
              <ColorInput />
            </ProForm.Item>
            <ProForm.Item label="背景色" name={['branding', 'colors', 'page_background']}>
              <ColorInput />
            </ProForm.Item>
          </Col>
          <Col span={14}>
            <ProFormDependency name={['branding', 'name', 'display_name']}>
              {({ branding, name, display_name }) => <LoginPreview params={{ 
                colors: branding?.colors, 
                name, 
                display_name,
              }}/>} 
            </ProFormDependency>
          </Col>
        </Row>
        <Divider />
        <ProCard style={{ marginBottom: '16px' }} title="元数据" collapsible={true} defaultCollapsed bordered>
          <ProForm.Item name="metadata">
            <MetadataEditor />
          </ProForm.Item>
        </ProCard>
      </ProForm>
    </Card>
    <h2 style={{ marginTop: '24px' }}>危险操作</h2>
    <DangerItem 
      title="删除当前组织" 
      description="所有成员都会被删除"
      actions={[
        <KeywordConfirmModal 
          title="确定要删除组织?"
          description={<>确定要删除组织: <b>{organization.name}?</b></>}
          keyword={organization.name}
          onOk={() => onDelete(organization.id)}
          trigger={<Button size="large" type="primary" danger>删除</Button>} />,
      ]}
    />
  </Space>;
};

export default OrganizationSettings;