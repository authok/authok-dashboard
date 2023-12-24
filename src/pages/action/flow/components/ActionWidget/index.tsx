import React from 'react';
import { Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Avatar from 'antd/lib/avatar/avatar';

interface ActionWidgetProps {
  icon?: string;
  title: string;
}

const ActionWidget: React.FC<ActionWidgetProps> = ({ icon, title }) => {
  return <Card hoverable style={{ width: 270, height: 72 }}>
    <Meta avatar={<Avatar src={icon} />} title={title} />
  </Card>;
  /*
  return <div className={styles.action}>
    <Space style={{ alignItems: 'center'}}>
      <Avatar src={icon} />
      <h3>{title}</h3>
    </Space>
  </div>;
  */
}

export default ActionWidget;