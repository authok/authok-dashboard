import React from 'react';
import { Card, Row, Col, Switch } from 'antd';

const SignUpSettings: React.FC = () => {
  return (
    <Card bordered style={{ marginTop: '16px', width: '100%' }}>
      <Row style={{ alignItems: 'center' }}>
        <Col span={18}>
          <h3>禁止注册</h3>
          <p>禁止新用户注册. 仍可通过 API 和 管理后台创建用户.</p>
        </Col>
        <Col span={6}>
          <Row justify="end">
            <Switch size="default" />
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default SignUpSettings;