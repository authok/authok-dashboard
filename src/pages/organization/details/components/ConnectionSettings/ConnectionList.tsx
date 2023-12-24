import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import ProList, { ProListMetas } from '@ant-design/pro-list'
import { PaginatedParams } from "@ahooksjs/use-request/lib/types";
import { formatProTablePagination } from '@/utils/formatter';
import { Avatar, Empty, Button } from 'antd';
import { useIntl, history } from 'umi';
import * as _ from 'lodash';
import { useMarketplaceCatalogPaginationByFeature } from '@/hooks/marketplace-catalog';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { useOrganizationEnabledConnections, useOrganizationAddConnection } from '@/hooks/organization';

interface ConnectionListProps {
  organization: API.Organization;
  params: PaginatedParams;
  strategyType: string;
}

const ConnectionList: React.FC<ConnectionListProps> = ({ organization, params, strategyType }) => {
  const { formatMessage } = useIntl();
  const actionRef = useRef();

  const { run: paginate, data: connectionPage } = useResourcePagination(ConnectionEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const { data: catalogs, run: loadCatalogs } = useMarketplaceCatalogPaginationByFeature('social-connections', {
    manual: true,
    formatResult: (page: API.Page<API.Catalog>) => page.items,
  });

  const { data: enabledConnections, refresh: refreshEnabledConnections } = useOrganizationEnabledConnections(organization.id, {
    formatResult: (page: API.Page<API.OrganizationEnabledConnection>) => page.items,
  });

  const { run: addConnection, loading: loadingAdd } = useOrganizationAddConnection();

  const handleAddConnection = useCallback(async (connection_id: string) => {
    await addConnection(organization.id, {
      connection_id,
    });

    // actionRef.current?.reloadAndRest();
    refreshEnabledConnections();

    history.goBack();
  }, [organization, refreshEnabledConnections]);

  const id2enabledConnections = useMemo(() => _.keyBy(enabledConnections, 'connection_id'), [enabledConnections]);

  useEffect(() => {
    if (connectionPage) {
      const catalogs = connectionPage.data.map(it => it.strategy);
      loadCatalogs({
        catalog_id: catalogs
      });
    }
  }, [connectionPage]);

  const strategy2catalog = useMemo(() => _.keyBy(catalogs || [], 'catalog_id'), [catalogs]);

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
      render: (_, record) => {
        const con = id2enabledConnections[record.id];
        return <Button disabled={!!con} type="primary" size="large" loading={loadingAdd} onClick={() => handleAddConnection(record.id)}>启用身份源</Button>;
      }
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
        </Empty>
    }}
    params={params}
    request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
  >
  </ProList>;
};

export default ConnectionList;
