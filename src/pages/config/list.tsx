import React from 'react';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';

const ConfigList: React.FC = () => {
  const columns = [];

  const queryList = async () => {};

  return (
    <PageContainer>
      <ProTable<API.Config>
        request={queryList}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary">
            <PlusOutlined /> 新建分组
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default ConfigList;
