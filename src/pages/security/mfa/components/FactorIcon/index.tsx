import React from 'react';
import { NotificationOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';

const icons = {
  sms: PhoneOutlined,
  'push-notification': NotificationOutlined,
  otp: LockOutlined,
};

interface FactorIconProps {
  factor: string;
}

const FactorIcon: React.FC<FactorIconProps> = ({ factor }) => {
  const Icon = icons[factor] || <NotificationOutlined />;
  return <Avatar size={40} shape="square">
    <Icon style={{ fontSize: 32 }} />
  </Avatar>;
};

export default FactorIcon;