import React from 'react';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Row, Col, Divider } from 'antd';
import { AndroidFilled, AppleFilled } from '@ant-design/icons';

const DeviceSettings: React.FC = () => {

  return (
    <>
      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col span={8}><h3><AppleFilled/> IOS</h3></Col>
        <Col span={16}>
          <ProFormText width="lg" label={<b>Team ID</b>} name={['mobile', 'ios', 'team_id']} placeholder="3AB92AQLEP"/>
          <ProFormText width="lg" label={<b>App ID</b>} name={['mobile', 'ios', 'app_bundle_identifier']} placeholder="com.my.authok.bundle" />
        </Col>
      </Row>
      <Divider orientationMargin={4} />
      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col span={8}><h3><AndroidFilled/> Android</h3></Col>
        <Col span={16}>
          <ProFormText width="lg" label={<b>包名</b>} name={['mobile', 'android', 'app_package_name']} placeholder="com.example"/>
          <ProFormTextArea width="lg" label={<b>Key哈希值</b>} fieldProps={{ rows: 3 }} name={['mobile', 'android', 'sha256_cert_fingerprints']} placeholder="C2:B3:21:..., B3:D2:C2:..." />
        </Col>
      </Row>
    </>);
};

export default DeviceSettings;