import React from 'react';
import { history } from 'umi';
import { Row, Col, Space, Card, Badge } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { formatPath } from '@/utils/link.utils';

interface FactorCardProps {
  avatar?: JSX.Element;
  title: string;
  description?: string;
  enabled?: boolean;
  link?: string;
}

const FactorCard: React.FC<FactorCardProps> = ({ avatar, title, description, enabled = false , link }) => {
  return <Card hoverable bordered>
    <Row align="middle" onClick={() => link && history.push(formatPath(link))}>
      <Col span={19}>
        <Space size="large" direction="horizontal" style={{ width: '100%' }}>
          {avatar}
          <Space direction="vertical">
            <h3>{title}</h3>
            <p>{description}</p>
          </Space>
        </Space>
      </Col>
      <Col span={4}>
        { enabled ? <Badge status="success" text="已开启" /> : <Badge color="gray" text="未开启" /> }
      </Col>
      <Col span={1}>
        <RightOutlined />
      </Col>
    </Row>
  </Card>
};

export default FactorCard;