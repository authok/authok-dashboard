import React from 'react';
import styles from './index.less';
import { Card, Row, Space } from 'antd';

interface LoginPreviewProps {
  params: Record<string, any>;
}

export const LoginPreview: React.FC<LoginPreviewProps> = ({ params }) => {
  return <Card style={{ backgroundColor: params.colors?.page_background }}>
    <Card>
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        <Row>
          <h3>{params.display_name}</h3>
        </Row>
        <Row>
          <div style={{ borderRadius: 4, height: 32, width: '100%', backgroundColor: 'rgb(239, 240, 242)' }}></div>
        </Row>
        <Row>
          <div style={{ height: 48, width: '100%', border: '1px solid rgb(239, 240, 242)', padding: 12 }}>
            <div style={{ borderRadius: 4, height: '100%', width: '100%', backgroundColor: 'rgb(239, 240, 242)' }}></div>
          </div>
        </Row>
        <Row>
          <div style={{ height: 48, width: '100%', border: '1px solid rgb(239, 240, 242)', padding: 12 }}>
            <div style={{ borderRadius: 4, height: '100%', width: '100%', backgroundColor: 'rgb(239, 240, 242)' }}></div>
          </div>
        </Row>
        <Row>
          <div style={{ borderRadius: 4, height: 48, width: '100%', border: '1px solid rgb(239, 240, 242)', padding: 12, backgroundColor: params.colors?.primary }}>
            <div style={{ height: '100%', width: '100%', backgroundColor: 'rgb(239, 240, 242)' }}></div>
          </div>
        </Row>
      </Space>
    </Card>
  </Card>;
}

export default LoginPreviewProps;