import React from 'react';
import { Divider, Space, Alert } from 'antd';
import ConnectionList from './ConnectionList';

interface ConnectionSettingsProps {
  application: API.Application;
}

export const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({ application }) => {
  return (
    <Space direction="vertical" style={{ width: '100%'}}>
      <Alert showIcon type="info" message="身份源代表用户来源. 主要分为 数据库, 社会化，企业 等类别, 可以被多个应用共享."/>
      <Space direction="vertical" style={{ width: '100%'}}>
        <Divider orientationMargin={8} orientation="left">数据库</Divider>
        <ConnectionList
          application={application}
          strategyType="database"
          params={{
            strategy: ['authok'],
            pageSize: 100,
          }}
        />
      </Space>
      <Space direction="vertical" style={{ width: '100%'}}>
        <Divider orientationMargin={8} orientation="left">社会化</Divider>
        <ConnectionList
          application={application}
          strategyType="social"
          params={{
            // strategy: ['wechat', 'doudian','github', 'tiktok', 'douyin', 'google', 'facebook'],
            strategy_type: 'social',
            pageSize: 100,
          }}
        />
      </Space>
      <Space direction="vertical" style={{ width: '100%'}}>
        <Divider orientationMargin={8} orientation="left">企业</Divider>
        <ConnectionList
          application={application}
          strategyType="enterprise"
          params={{
            strategy: ['saml', 'wsfed'],
            pageSize: 100,  
          }}
        />
      </Space>
      <Space direction="vertical" style={{ width: '100%'}}>
        <Divider orientationMargin={8} orientation="left">免密登录</Divider>
        <ConnectionList 
          application={application} 
          strategyType="passwordless"
          params={{
            strategy: ['sms', 'email'],
            pageSize: 100,  
          }}
        />
      </Space>
    </Space>
  );
}

export default ConnectionSettings;