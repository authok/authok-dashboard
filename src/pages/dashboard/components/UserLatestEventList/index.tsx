import React, { useState } from 'react';
import { Card, Tooltip, Avatar } from 'antd';
import { Link } from 'umi';
import { formatPath } from '@/utils/link.utils';
import ProList from '@ant-design/pro-list';
import { useResourceCursorList, useResourcePagination } from '@/hooks/useResource';
import { LogEntity } from '@/api/entities/log.entity';
import { UserEntity } from '@/api/entities/user.entity';
import styles from './index.less';

export default function() {
  const [tab, setTab] = useState('login_history');

  const renderTab = (key: string) => {
    switch (key) {
      case 'login_history': 
        return <LoginHistory />
      case 'register_history':
        return <RegisterHistory />;
    } 
  };

  return <div className={styles.latestEvents}>
    <Card 
      tabList={[
        {
          tab: '最近登录',
          key: 'login_history',
        },
        {
          tab: '最近注册',
          key: 'register_history',
        }
      ]}
      onTabChange={(key) => setTab(key)}
      tabBarExtraContent={<Link to={formatPath(`/user_mgmt/users`)}>查看更多</Link>}
    >
      {renderTab(tab)}
    </Card>
  </div>;
}

const LoginHistory = () => {
  const {  data, loading } = useResourcePagination(UserEntity, {
    defaultParams: [{
      sort: '-last_login',
      page_size: 10,
    }],
    formatResult: (page: API.Page<API.User>) => page.items,
  } as any);

  return <ProList<API.User>
    rowKey="user_id"
    loading={loading}
    toolBarRender={() => (
      <Avatar.Group maxCount={10} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }} style={{ marginRight: 24 }}>
        {data?.map(it => (
          <Tooltip key={it.user_id} title={it.username || it.nickname || it.email || it.phone_number} placement="top">
            <Avatar style={{ backgroundColor: '#87d068' }} src={it.picture} />
          </Tooltip>
        ))}        
      </Avatar.Group>
    )}
    metas={{
      avatar: {
        render: (_, record) => <Avatar size={24} src={record.picture}/>,
      },
      title: {
        render: (_, record) => <Link to={formatPath(`/user_mgmt/users/${record.user_id}`)}>{record.username || record.nickname || record.email || record.phone_number}</Link>,
      }
    }}
    dataSource={data}
    pagination={false}
  />;
};

const RegisterHistory = () => {
  const {  data, loading } = useResourcePagination(UserEntity, {
    defaultParams: [{
      sort: '-signup_at',
      page_size: 10,
    }],
    formatResult: (page: API.Page<API.User>) => page.items,
  } as any);

  return <ProList<API.User>
    rowKey="user_id"
    loading={loading}
    toolBarRender={() => (
      <Avatar.Group maxCount={10} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }} style={{ marginRight: 24 }}>
        {data?.map(it => (
          <Tooltip key={it.user_id} title={it.username || it.nickname || it.email || it.phone_number} placement="top">
            <Avatar style={{ backgroundColor: '#87d068' }} src={it.picture} />
          </Tooltip>
        ))}
      </Avatar.Group>
    )}
    metas={{
      avatar: {
        render: (_, record) => <Avatar size={24} src={record.picture}/>,
      },
      title: {
        render: (_, record) => <Link to={formatPath(`/user_mgmt/users/${record.user_id}`)}>{record.username || record.nickname || record.email || record.phone_number}</Link>,
      }
    }}
    dataSource={data}
    pagination={false}
  />;
};