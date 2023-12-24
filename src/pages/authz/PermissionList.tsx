import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import XProTable from '@/components/XProTable';

export default () => {
  return (
    <PageContainer>
      <XProTable<API.PolicyAssignment> />
    </PageContainer>
  );
};
