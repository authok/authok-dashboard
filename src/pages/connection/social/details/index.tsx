import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Typography, Space, Dropdown, Empty, Menu, Card, Avatar } from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import SocialConnectionSettings from './components/SocialConnectionSettings';
import { CaretRightOutlined } from '@ant-design/icons';
import { AuthokClient } from '@authok/authok-spa-js';
import * as _ from 'lodash';
import { useSessionStorageState } from '@umijs/hooks';
import ApplicationSettings from '../../components/ApplicationSettings';
import { history } from 'umi';
import { useMarketplaceCatalogDetails } from '@/hooks/marketplace-catalog';
import { useResourceDetails, useResourceUpdate, useResourceDelete, useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity, ClientEntity } from '@/api';
import { useTenantDetails } from '@/hooks/tenant';
import { formatPath } from '@/utils/link.utils';
const { Text } = Typography;

const SocialConnectionDetailsPage: React.FC<any> = ({ match }) => {
  const { id, tab: _tab } = match.params;

  const { data: tenantSettings } = useTenantDetails();
  const { error, data: connection, loading, refresh } = useResourceDetails(ConnectionEntity, id);
  const { run: update } = useResourceUpdate(ConnectionEntity);
  const { run: deleteConnection } = useResourceDelete(ConnectionEntity);
  const { data: catalog, run: fetchCatalog } = useMarketplaceCatalogDetails('social-connections', connection?.strategy, {
    manual: true,
  });
  const { data: enabled_clients, run: fetchEnabledClients } = useResourcePagination(ClientEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Application>) => page.items,
  } as any);

  useEffect(() => {
    if (connection) {
      fetchCatalog('social-connections', connection.strategy);
      fetchEnabledClients({
        client_id: connection.enabled_clients,
        token_endpoint_auth_method: 'none',
        fields: 'client_id,name,app_type,logo_uri',
      });
    }
  }, [connection]);

  const handleUpdate = useCallback(async (data: Partial<API.Connection>) => {
    console.log('update value: ', data);
    await update(id, data);

    message.success('保存成功');
    await refresh();
  }, [connection]);

  const handleDeleteConnection = useCallback(async (id: string) => {
    await deleteConnection(id);

    history.push(formatPath('/connections/social'));
  }, [connection]);

  const [tab, setTab] = useState(_tab || 'settings');

  const testOverlay = useMemo(() => <Menu>
    {enabled_clients?.map(it => (
      <Menu.Item key={it.client_id} onClick={() => handleTry(it.client_id)} icon={<Avatar shape="square" size={24} src={it.logo_uri}/>}>{it.name}</Menu.Item>
    ))}
  </Menu>, [enabled_clients]);

  const [testerParams, setTesterParams] = useSessionStorageState<Record<string, any>>('tester_params');
  const handleTry = async (client_id: string) => {
    if (!connection) return;
    if (!tenantSettings) return;
    
    const redirect_uri = `${window.location.origin}/connections/tester/callback`;
    setTesterParams({
      domain: tenantSettings.domain,
      client_id: client_id,
      connection: connection.name,
    });

    const authokClient = new AuthokClient({
      domain: tenantSettings.domain,
      client_id,
      cacheLocation: 'localstorage',
    });

    const url = await authokClient.buildAuthorizeUrl({
      scope: 'openid email profile',
      connection: connection.name,
      prompt: 'login',
      redirect_uri,
    });

    window.open(url);
  }

  const renderTab = (key: string) => {
    if (key === 'settings') return <SocialConnectionSettings connection={connection} onUpdate={handleUpdate} onDelete={handleDeleteConnection}/>;
    else if (key === 'applications') return <ApplicationSettings connection={connection} onUpdate={handleUpdate}/>;
    return null;
  }

  if (loading && !connection) {
    return <PageContainer><ProSkeleton type="descriptions" error={error}/></PageContainer>;
  }

  if (!connection) {
    return <PageContainer><Empty/></PageContainer>;  
  }

  return (
    <PageContainer 
      className="page-middle"
      avatar={{
        src: catalog?.icon,
        size: 64,
      }}
      title={<Space direction="vertical">
        <h2 style={{ marginBlockEnd: 0 }}>{catalog?.metaTitle || connection.name}</h2>
        <Space size="middle" style={{ fontSize: 14, fontWeight: 'normal' }}>
          <Space>
            <Text>身份提供者唯一标识: {connection.strategy}</Text>
          </Space>
          <Text>身份源ID: </Text> 
          <Text keyboard>
            {connection.id}
          </Text>
        </Space>
      </Space>}
      extra={
        <Dropdown.Button loading={!tenantSettings} size="large" icon={<CaretRightOutlined/>} overlay={testOverlay}>测试</Dropdown.Button>
      }
      tabList={[
        {
          key: 'settings',
          tab: '设置',
        },{
          key: 'applications',
          tab: '应用'
        }
      ]}
      tabActiveKey={tab}
      onTabChange={(key: string) => {
        setTab(key);
        history.push(formatPath(`/connections/social/${connection.id}/${key}`));
      }}
    >
      <Card bordered={false}>
        {renderTab(tab)}
      </Card>
    </PageContainer>
  );
}

export default SocialConnectionDetailsPage;