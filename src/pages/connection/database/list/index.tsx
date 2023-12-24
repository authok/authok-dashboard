import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, Card, Dropdown, Menu } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history, Link } from 'umi';
import ProList from '@ant-design/pro-list';
import Avatar from 'antd/lib/avatar/avatar';
import { formatProTablePagination } from '@/utils/formatter';
import { useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';

const DatabaseConnectionList: React.FC = () => {
  const { run, loading } = useResourcePagination(ConnectionEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const metas = {
    title: {
      render: (text, row) => <Link to={formatPath(`/connections/database/${row.id}/settings`)}><h3>{row.display_name || row.name}</h3></Link>
    },
    avatar: {
      render: (_, row) => <Avatar shape="square" size={48} src="https://cdn.authok.cn/market/catalog/assets/connections/social/authok.svg"/>,
    },
    content: {
      render: (_, record) => {
        return <span>共开启了 <Link to={formatPath(`/connections/database/${record.id}/applications`)}>{(record.enabled_clients || []).length}个应用</Link></span>;
      },
    },
    description: {
      dataIndex: 'strategy',
    },
    actions: {
      render: (_, row) => {
        const actionMenu = (
          <Menu onClick={({ key }) => history.push(formatPath(`/connections/database/${row.id}/${key}`))}>
            <Menu.Item key="settings">设置</Menu.Item>
            <Menu.Item key="password_policy">密码策略</Menu.Item>
            <Menu.Item key="custom_database">自定义数据库</Menu.Item>
            <Menu.Item key="applications">应用</Menu.Item>
          </Menu>
        );

        return <Dropdown.Button overlay={actionMenu} trigger="click" />;
      },
    }
  };
  
  return (
    <PageContainer>
      <Card bordered={false}>
        <Alert showIcon message={<>在 authok 或者自定义数据库中安全存储 用户名 / 密码 凭证. <a href="https://docs.authok.cn/xx" target="_blank">了解更多</a></>}/>
        <ProList<API.Connection>
          params={{
            strategy: 'authok',
          }}
          request={(params, sort, filter) => { 
            // params.strategy = 'authok';
            return run(formatPageQuery(params, sort, filter));
          }}
          loading={loading}
          rowKey="id"
          headerTitle="数据库身份源"
          pagination={{
            pageSize: 10,
          }}
          metas={metas}
          toolBarRender={() => (
            <Link to={formatPath('/connections/database/create')}>
              <Button size="large" type="primary" icon={<PlusOutlined/>}>创建数据身份源</Button>
            </Link>
          )}
        />
      </Card>
    </PageContainer>
  );
};

export default DatabaseConnectionList;