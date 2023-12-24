import React, { useRef, useEffect, useMemo } from 'react';
import ProList, { ProListMetas } from '@ant-design/pro-list'
import { PaginatedParams } from "@ahooksjs/use-request/lib/types";
import { formatProTablePagination } from '@/utils/formatter';
import { Avatar, Switch, Button, Empty } from 'antd';
import { Link, useIntl } from 'umi';
import * as _ from 'lodash';
import { useMarketplaceCatalogPaginationByFeature } from '@/hooks/marketplace-catalog';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useResourcePagination, useResourceUpdate } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';

interface ConnectionListProps {
  application: API.Application;
  params: PaginatedParams;
  strategyType: string;
}

const ConnectionList: React.FC<ConnectionListProps> = ({ application, params, strategyType }) => {
  const { formatMessage } = useIntl();
  const actionRef = useRef();

  const { run: paginate, data: connectionPage } = useResourcePagination(ConnectionEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const { run: updateConnection } = useResourceUpdate(ConnectionEntity);

  const { data: catalogs, run: loadCatalogs } = useMarketplaceCatalogPaginationByFeature('social-connections', {
    manual: true,
    formatResult: (page: API.Page<API.Catalog>) => page.items,
  });

  useEffect(() => {
    if (connectionPage) {
      const catalogs = connectionPage.data.map(it => it.strategy);
      loadCatalogs({
        catalog_id: catalogs
      });
    }
  }, [connectionPage]);

  const strategy2catalog = useMemo(() => _.keyBy(catalogs || [], 'catalog_id'), [catalogs]);


  const handleEnableClient = async (connection: API.Connection) => {
    const enabled_clients = [...connection.enabled_clients];

    // 添加
    const idx = enabled_clients.findIndex(it => application.client_id === it);
    if (idx < 0) {
      enabled_clients.push(application.client_id);

      await updateConnection(connection.id, {
        enabled_clients,
      });

      actionRef.current?.reloadAndRest();
    }
  };

  const handleDisableClient = async (connection: API.Connection) => {
    const enabled_clients = [...connection.enabled_clients];

    // 删除
    const idx = enabled_clients.findIndex(it => application.client_id === it);
    console.log('idx: ', connection.id, connection.name, idx);
    if (idx >= 0) {
      enabled_clients.splice(idx, 1);

      await updateConnection(connection.id, {
        enabled_clients,
      });

      actionRef.current?.reloadAndRest();
    }
  };

  const handleChange = (connection: API.Connection) => (v: boolean) => {
    if (v) {
      handleEnableClient(connection);
    } else {
      handleDisableClient(connection);
    }
  };

  const metas: ProListMetas<API.Connection> = {
    avatar: {
      render: (_, record) => {
        const catalog = strategy2catalog[record.strategy];
        if (catalog) {
          return <Avatar size="large" src={catalog.icon} />;
        } else {
          if (record.strategy === 'authok') {
            return <Avatar size="large" src={'https://cdn.authok.cn/market/catalog/assets/connections/social/authok.svg'} />;
          } else if (record.strategy === 'sms') {
            return <Avatar size="large" icon={<PhoneOutlined />} />;
          } else if (record.strategy === 'email') {
            return <Avatar size="large" icon={<MailOutlined />} />;  
          }
        }
      },
    },
    title: {
      render: (_, record) => {
        const catalog = strategy2catalog[record.strategy];
        return record.display_name || catalog?.name || record.name;
      }
    },
    description: {
      render: (_, record) => {
        const catalog = strategy2catalog[record.strategy];
        return record.name;
      }
    },
    actions: {
      valueType: 'option',
      render: (_, record) => {
        return <Switch checked={record.enabled_clients.includes(application.client_id)} onChange={handleChange(record)} />;
      },
    }
  };

  return <ProList<API.Connection>
    rowKey="id"
    actionRef={actionRef}
    metas={metas}
    locale={{
      emptyText: <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<>没有可用的{ formatMessage( { id: `app.settings.connection.strategy.${strategyType}`}) }身份源</>}
        >
          <Link to={formatPath(`/connections/${strategyType}/create`)}><Button type="primary">创建{ formatMessage({ id: `app.settings.connection.strategy.${strategyType}` }) }身份源</Button></Link>
        </Empty>
    }}
    params={params}
    request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
    pagination={false}
  >
  </ProList>;
};

export default ConnectionList;
