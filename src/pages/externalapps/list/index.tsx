import React from 'react';
import { PageContainer } from "@ant-design/pro-layout";
import { Dropdown, Menu, Avatar, Button } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import ProList, { ProListMetas } from '@ant-design/pro-list';
import { formatProTablePagination } from "@/utils/formatter";
import { useResourcePagination } from "@/hooks/useResource";
import { ClientEntity } from "@/api";
import { formatPageQuery } from "@/utils/utils";
import { useRef, useEffect, useMemo } from "react";
import { Link } from 'umi';
import { useMarketplaceCatalogPaginationByFeature } from "@/hooks/marketplace-catalog";
import { formatPath } from "@/utils/link.utils";
import * as _ from 'lodash'; 

export default function() {
  const actionRef = useRef();

  const { data: applications, loading: loadingPaginate, run: paginateApplications } = useResourcePagination(
    ClientEntity,
    {
      manual: true,
      formatResult: formatProTablePagination,
    },
  );

  const { run: loadCatalogs, data: catalogs } = useMarketplaceCatalogPaginationByFeature('sso-integrations', {
    manual: true,
    formatResult: (page: API.Page<API.Catalog>) => page.items,
  } as any);

  useEffect(() => {
    if (applications) {
      loadCatalogs({
        catalog_id: applications.data.map(it => it.app_type)
      });
    }
  }, [applications]);

  const id2catalog = useMemo(() => _.keyBy(catalogs, 'catalog_id'), [catalogs]);

  const metas: ProListMetas<API.Application> = {
    avatar: {
      render: (_, row) => {
        const catalog = id2catalog[row.app_type];
        return <Avatar src={catalog?.icon} size={48} shape="square" />;
      }
    },
    title: {
      dataIndex: 'name',
      render: (_, row) => <Link to={formatPath(`/app/externalapps/${row.client_id}`)}><b style={{ fontSize: 16 }}>{row.name}</b></Link>,
    },
    description: {
      render: (_, row) => {
        const catalog = id2catalog[row.app_type];        
        return <p>应用类型: {catalog?.name}</p>;
      }
    },
    actions: {
      render: (_, row) => (
        <Dropdown.Button overlay={
          <Menu>
            <Menu.Item key="settings"><Link to={formatPath(`/app/externalapps/${row.client_id}/settings`)}>设置</Link></Menu.Item>
            <Menu.Item key="connections"><Link to={formatPath(`/app/externalapps/${row.client_id}/connections`)}>身份源</Link></Menu.Item>
            <Menu.Item key="tutorial"><Link to={formatPath(`/app/externalapps/${row.client_id}/tutorial`)}>使用说明</Link></Menu.Item>
          </Menu>
        } />
      )
    },
  };

  return <PageContainer 
    className="page-middle"
    extra={<Link to={formatPath(`app/externalapps/create`)}><Button size="large" type="primary" icon={<PlusOutlined/>}>添加SSO集成</Button></Link>}
  >
    <ProList<API.Application>
      rowKey="client_id"
      params={{
        app_type: [
          'sso_integrations',
          'qcloud',
          'slack',
        ],
      }}
      loading={loadingPaginate}
      actionRef={actionRef}
        request={(params, sorter, filter) => paginateApplications(
          formatPageQuery(
            params, sorter, filter, 
            'client_id,name,app_type,logo_uri',
          )
        )}
        pagination={{
          pageSize: 10,
        }}
        metas={metas}
      />
  </PageContainer>;
}