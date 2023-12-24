import React from 'react';
import ProTable from '@ant-design/pro-table';
import { Card, Empty } from 'antd';

interface UserDevicesProps {
  user: API.User;
}

const UserDevices: React.FC<UserDevicesProps> = ({ user }) => {
  const columns = [
    {
      title: 'Client',
      dataIndex: 'client',
    },
    {
      title: '设备',
      dataIndex: 'device',
    },
    {
      title: '刷新令牌数量',
      dataIndex: 'refresh_token_counts',
    }
  ];

  return <ProTable
    search={false}
    options={false}
    columns={columns}
    locale={{
      emptyText: <Empty description={<>暂无任何已连接设备</>}/>
    }}
  />;
};

export default UserDevices;