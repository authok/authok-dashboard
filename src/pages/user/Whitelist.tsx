import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import styles from './Whitelist.less';

export default () => {
  return (
    <PageContainer>
      <Card>
        <Tabs>
          <Tabs.TabPane tab="邮箱" key="email" />
          <Tabs.TabPane tab="手机号" key="mobile" />
          <Tabs.TabPane tab="用户名" key="usename" />
        </Tabs>
      </Card>
    </PageContainer>
  );
}
