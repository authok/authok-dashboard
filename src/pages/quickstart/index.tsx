import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import { useTenantDetails } from '@/hooks/tenant';

const QuickStart: React.FC = () => {
  const { data :tenant } = useTenantDetails();

  const link = `https://${tenant.domain}/authorize?client_id=`;

  return <PageContainer>
    <Card bordered>
      <a href={link} target="_blank">登录测试</a>
    </Card>
  </PageContainer>;
};

export default QuickStart;