import React from 'react';
import { Card, Row, Col } from 'antd';

interface DangerItemProps {
  title?: string;
  description?: string;
  actions?: JSX.Element[];
}

const DangerItem: React.FC<DangerItemProps> = ({ title, description, actions }) => {
  return (
    <Card style={{ background: '#ffeeed' }}>
      <Row gutter={16} style={{ alignItems: 'center' }}>
        <Col span="8">
          <h4>{title}</h4>
          <div style={{ color: 'rgba(0,0,0,.45)' }}>{description}</div>
        </Col>
        <Col span="12"></Col>
        <Col span="4">
          <Row justify="end">
            {actions?.map((it, index) => <span key={index}>{it}</span>)}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default DangerItem;