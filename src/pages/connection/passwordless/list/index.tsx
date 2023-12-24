import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card, Dropdown, Menu, Space } from 'antd';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { history, Link, FormattedMessage } from 'umi';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import Avatar from 'antd/lib/avatar/avatar';
import * as _ from 'lodash';
import Text from 'antd/lib/typography/Text';
import { formatProTablePagination } from '@/utils/formatter';
import { useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';

const PasswordlessConnectionList: React.FC = () => {
  const { run } = useResourcePagination(ConnectionEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });
  
  const metas: ProListMetas<API.Connection> = {
    title: {
      render: (text, record) => <Link to={formatPath(`/connections/passwordless/${record.strategy}/${record.id}/settings`)}><h3>{record.display_name || record.name}</h3></Link>
    },
    avatar: {
      render: (_, record) => {
        const icon = record.strategy === 'sms' ? <PhoneOutlined /> : <MailOutlined />;
        return <Avatar shape="square" size={48} icon={icon} />;
      }
    },
    content: {
      render: (_, record) => {
        return (<Space direction="vertical">
          <Text copyable>{record.name}</Text>
          <span>共开启了 <Link to={formatPath(`/connections/passwordless/${record.strategy}/${record.id}/applications`)}>{(record.enabled_clients || []).length}个应用</Link></span>
          </Space>);
      },
    },
    description: {
      render: (_, record) => {
        return <FormattedMessage id={`app.settings.connection.strategy.${record.strategy}`} />;
      },
    },
    actions: {
      render: (_, record) => {
        const actionMenu = (
          <Menu onClick={({ key }) => history.push(formatPath(`/connections/passwordless/${record.strategy}/${record.id}/${key}`))}>
            <Menu.Item key="settings">设置</Menu.Item>
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
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert showIcon message={<>配置免密登录 <a href="https://docs.authok.cn/xx" target="_blank">了解更多</a></>}/>
          <ProList<API.Connection>
            params={{
              strategy_type: ['passwordless'],
            }}
            request={(params, sort, filter) => run(formatPageQuery(params, sort, filter))}
            rowKey="id"
            pagination={{
              pageSize: 20,
            }}
            metas={metas}
          />
        </Space>
      </Card>
    </PageContainer>
  );
};

export default PasswordlessConnectionList;