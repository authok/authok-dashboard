import React, { useEffect, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, Card, Dropdown, Menu, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history, Link } from 'umi';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import Avatar from 'antd/lib/avatar/avatar';
import { formatProTablePagination } from '@/utils/formatter';
import { useMarketplaceCatalogPaginationByFeature } from '@/hooks/marketplace-catalog';
import * as _ from 'lodash';
import Text from 'antd/lib/typography/Text';
import { useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';

const SocialConnectionList: React.FC = () => {
  const strategy_type = ['social'];
  
  const { run, loading, data: connections } = useResourcePagination(ConnectionEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const { data: catalogs, run: loadCatalogs } = useMarketplaceCatalogPaginationByFeature('social-connections', {
    manual: true,
    formatResult: (page: API.Page<API.Catalog>) => page.items,
  });

  useEffect(() => {
    if (connections) {
      const catalogs = connections.data.map(it => it.strategy);
      loadCatalogs({
        catalog_id: catalogs
      });
    }
  }, [connections]);

  const strategy2catalog = useMemo(() => _.keyBy(catalogs || [], 'catalog_id'), [catalogs]);

  const metas: ProListMetas<API.Connection> = {
    avatar: {
      render: (_, record) => <Avatar shape="square" size={48} src={strategy2catalog[record.strategy]?.icon}/>,
    },
    title: {
      render: (text, record) => {
        const catalog = strategy2catalog[record.strategy];
        const title = record.display_name || catalog?.name || record.name;

        return <Link to={formatPath(`/connections/social/${record.id}/settings`)}><h3>{title}</h3></Link>
      }
    },
    description: {
      render: (_, record) => {
        const catalog = strategy2catalog[record.strategy];
        return <>{ catalog ? catalog.name : record.strategy}</>;
      },
    },
    content: {
      render: (_, record) => {
        return (<Space direction="vertical">
          <Space>唯一标识: <Text copyable={{ text: record.name }}><Text code>{record.name}</Text></Text></Space>
          <span>共开启了 <Link to={formatPath(`/connections/social/${record.id}/applications`)}>{(record.enabled_clients || []).length}个应用</Link></span>
        </Space>);
      },
    },
    actions: {
      render: (_, record) => {
        const actionMenu = (
          <Menu onClick={({ key }) => history.push(formatPath(`/connections/social/${record.id}/${key}`))}>
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
        <Alert showIcon message={<>配置社会化登录 <a href="https://docs.authok.cn/xx" target="_blank">了解更多</a></>}/>
        <ProList<API.Connection>
          params={{
            strategy_type,
          }}
          request={(params, sort, filter) => run(formatPageQuery(params, sort, filter))}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 20,
          }}
          metas={metas}
          toolBarRender={() => (
            <Link to={formatPath('/connections/social/create')}>
              <Button 
                size="large" 
                type="primary" 
                icon={<PlusOutlined/>} 
                onClick={()=> {
              }}>创建社会化身份源</Button>
            </Link>
          )}
        />
      </Card>
    </PageContainer>
  );
};

export default SocialConnectionList;