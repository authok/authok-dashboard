import React from 'react';
import { Space, Divider } from 'antd';
import TenantDropdown from '../TenantDropdown';

interface HeaderContentProps {
}

const HeaderContent: React.FC<HeaderContentProps> = (props) => {

  return (
    <Space direction="horizontal" style={{ marginLeft: '12px' }}>
      <Divider type="vertical" style={{ background: '#FFFFFF' }}/>
      <TenantDropdown />
    </Space>
  );
}

export default HeaderContent;