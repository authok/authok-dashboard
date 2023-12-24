import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import ProList, { ProListMetas } from '@ant-design/pro-list'
import { PaginatedParams } from "@ahooksjs/use-request/lib/types";
import { formatProTablePagination } from '@/utils/formatter';
import { Avatar, Empty, Dropdown, Menu, Button, Typography, Popconfirm, Drawer, Space, Badge } from 'antd';
import * as _ from 'lodash';
import { useMarketplaceCatalogPaginationByFeature } from '@/hooks/marketplace-catalog';
import { MailOutlined, PhoneOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatPageQuery } from '@/utils/utils';
import { useOrganizationEnabledConnections, useOrganizationDeleteConnection, useOrganizationUpdateConnection } from '@/hooks/organization';
import { formatPath } from '@/utils/link.utils';
import { history } from 'umi';
const { Text } = Typography;
import { DrawerForm, ProFormSwitch, ProFormText } from '@ant-design/pro-form';

interface ConnectionSettingsProps {
  organization: API.Organization;
  params: PaginatedParams;
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({ organization, params }) => {
  const actionRef = useRef();

  const { run: paginate, data: connectionPage } = useOrganizationEnabledConnections(organization.id, {
    manual: true,
    formatResult: formatProTablePagination,
  } as any);

  const { run: deleteConnection, loading: loadingDelete } = useOrganizationDeleteConnection();
  const { run: updateConnection } = useOrganizationUpdateConnection();

  const { data: catalogs, run: loadCatalogs } = useMarketplaceCatalogPaginationByFeature('social-connections', {
    manual: true,
    formatResult: (page: API.Page<API.Catalog>) => page.items,
  });

  const [currentConnection, setCurrentConnection] = useState<API.OrganizationEnabledConnection>();

  useEffect(() => {
    if (connectionPage) {
      const catalogs = connectionPage.data.map(it => it.strategy);
      loadCatalogs({
        catalog_id: catalogs
      });
    }
  }, [connectionPage]);

  const strategy2catalog = useMemo(() => _.keyBy(catalogs || [], 'catalog_id'), [catalogs]);

  const handleDeleteConnection = useCallback(async (connection_id: string) => {
    await deleteConnection(organization.id, connection_id);

    actionRef.current?.reloadAndRest();

  }, [organization, deleteConnection]);

  const handleUpdate = useCallback(async (connection: Partial<API.OrganizationEnabledConnection>): Promise<boolean> => {
    if (!currentConnection) return false;
    
    await updateConnection(organization.id, currentConnection.connection_id, connection);
    actionRef.current?.reloadAndRest();

    return true;
  }, [currentConnection]);


  const metas: ProListMetas<API.Connection> = {
    avatar: {
      render: (_, record) => {
        const catalog = strategy2catalog[record.connection?.strategy];
        if (catalog) {
          return <Avatar size="large" src={catalog.icon} />;
        } else {
          if (record.connection?.strategy === 'authok') {
            return <Avatar size="large" src={'https://cdn.authok.cn/market/catalog/assets/connections/social/authok.svg'} />;
          } else if (record.connection?.strategy === 'sms') {
            return <Avatar size="large" icon={<PhoneOutlined />} />;
          } else if (record.connection?.strategy === 'email') {
            return <Avatar size="large" icon={<MailOutlined />} />;  
          }
        }
      },
    },
    title: {
      render: (_, record) => {
        const catalog = strategy2catalog[record.connection.strategy];
        return <span onClick={() => setCurrentConnection(record)}>{record.connection.display_name || catalog?.name || record.connection?.name}</span>;
      }
    },
    description: {
      render: (_, record) => {
        const catalog = strategy2catalog[record.connection?.strategy];
        return record.connection.name;
      }
    },
    content: {
      render: (_, record) => {
        return <Space direction="vertical">
          <span>身份源ID: <Text code copyable>{record.connection?.id}</Text></span>
          <span>认证时自动加入组织:  { record.assign_membership_on_login ? <Badge status="success" text="已启用" /> : <Badge color="gray" text="未启用" /> }</span>
        </Space>;
      }
    },
    actions: {
      valueType: 'option',
      render: (_, record) => {
        const overlay = <Menu>
          <Menu.Item key="remove" icon={<DeleteOutlined />}>
            <Popconfirm title="确定要移除当前身份源" okText="是" cancelText="否" onConfirm={() => handleDeleteConnection(record.connection_id)}>
              移除身份源
            </Popconfirm>
          </Menu.Item>
        </Menu>

        return <Dropdown.Button loading={loadingDelete} overlay={overlay}/>
      },
    }
  };

  return <>
    <EnabledConnectionDrawer connection={currentConnection} visible={!!currentConnection} onFinish={handleUpdate} onVisibleChange={(v) => {
      if (!v) setCurrentConnection(undefined);
    }}/>
    <ProList<API.Connection>
      toolBarRender={() => [
        <Button size="large" type="primary" onClick={() => history.push(formatPath(`/organizations/${organization.id}/connections/add`))}>启用身份源</Button>
      ]}
      rowKey="id"
      actionRef={actionRef}
      metas={metas}
      locale={{
        emptyText: <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<>没有可用的身份源</>}
          >
          </Empty>
      }}
      params={params}
      request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
      pagination={false}
    />
  </>;
};

interface EnabledConnectionDrawerProps {
  connection?: API.OrganizationEnabledConnection;
  visible?: boolean;
  onFinish?: (connection: Partial<API.OrganizationEnabledConnection>) => Promise<boolean>;
  onVisibleChange: (visible: boolean) => void;
}

const EnabledConnectionDrawer: React.FC<EnabledConnectionDrawerProps> = ({ connection, visible, onFinish, onVisibleChange }) => {
  return <DrawerForm
    visible={visible}
    onVisibleChange={onVisibleChange}
    onFinish={onFinish}
    title={connection?.connection?.name}
    drawerProps={{
      destroyOnClose: true,
    }}
    initialValues={connection}
  >
    <ProFormText label="身份源ID" disabled value={connection?.connection_id} />
    <ProFormSwitch label="登录身份源时自动加入组织" name="assign_membership_on_login" />
  </DrawerForm>;
};

export default ConnectionSettings;
