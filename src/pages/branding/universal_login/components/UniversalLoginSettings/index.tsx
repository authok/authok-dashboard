import React from 'react';
import ProForm, { ProFormDependency } from '@ant-design/pro-form';
import { Card, Row, Col } from 'antd';
import ColorInput from '@/components/ColorInput';
import { LoginPreview } from '@/pages/organization/details/components/LoginPreview';


interface UniversalLoginSettingsProps {
  branding: API.Branding;
  onUpdate: (branding: API.Branding) => void;
}

const UniversalLoginSettings: React.FC<UniversalLoginSettingsProps> = ({ branding, onUpdate }) => {
  return <Card>
    <ProForm 
      initialValues={branding}
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
        <Col span={10}>
          <h3>品牌化</h3>
          <ProForm.Item label="主色" name={['colors', 'primary']}>
            <ColorInput />
          </ProForm.Item>
          <ProForm.Item label="背景色" name={['colors', 'page_background']}>
            <ColorInput />
          </ProForm.Item>
        </Col>
        <Col span={14}>
          <ProFormDependency name={['colors', 'name', 'display_name']}>
            {(params) => <LoginPreview params={params}/>} 
          </ProFormDependency>
        </Col>
      </Row>
    </ProForm>
  </Card>;
};

export default UniversalLoginSettings;