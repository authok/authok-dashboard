import React, { useCallback, useEffect, useMemo } from 'react';
import { Avatar, Menu, Dropdown, Typography, Space, Empty, Card } from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import * as _ from 'lodash';
import { history } from 'umi';
import { AuthokClient } from '@authok/authok-spa-js';
import { useMarketplaceCatalogDetails } from '@/hooks/marketplace-catalog';
import { useResourceDetails, useResourceUpdate, useResourceDelete, useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity, ClientEntity } from '@/api';
import { formatPath } from '@/utils/link.utils';
import EnterpriseConnectionSettings from './components/EnterpriseConnectionSettings';
import ApplicationSettings from '../../components/ApplicationSettings';
import SAMLSetup from './components/samlp/SAMLSetup';
import { CaretRightOutlined } from '@ant-design/icons';
import { useSessionStorageState } from '@umijs/hooks';
import { useTenantDetails } from '@/hooks/tenant';
const { Text } = Typography;

const defaultTabList = [
  {
    key: 'settings',
    tab: '设置',
  },
  {
    key: 'applications',
    tab: '应用'
  }
];

const samlpTabList = [
  {
    key: 'settings',
    tab: '设置',
  },
  {
    key: 'setup',
    tab: '安装',
  },
  {
    key: 'applications',
    tab: '应用'
  }
];

const defaultTabRenderMap = {
  settings: (props: any) => <EnterpriseConnectionSettings {...props} />,
  applications: (props: any) => <ApplicationSettings {...props}/>
};

const samlpTabRenderMap = {
  settings: (props: any) => <EnterpriseConnectionSettings {...props} />,
  setup: (props: any) => <SAMLSetup {...props} />,
  applications: (props: any) => <ApplicationSettings {...props}/>
};

const gTabListMap = {
  samlp: samlpTabList,
  oidc: defaultTabList,
}

const gTabRenderMap = {
  samlp: samlpTabRenderMap,
  oidc: defaultTabRenderMap,
}

const EnterpriseConnectionDetailsPage: React.FC<any> = ({ match }) => {
  const { strategy, id, tab = 'settings' } = match.params;

  const tabList = gTabListMap[strategy];

  const { data: tenantSettings } = useTenantDetails();
  const { error, data: connection, loading, refresh } = useResourceDetails(ConnectionEntity, id);
  const { run: update } = useResourceUpdate(ConnectionEntity);
  const { run: deleteConnection } = useResourceDelete(ConnectionEntity);
  const { data: catalog, run: fetchCatalog } = useMarketplaceCatalogDetails('enterprise-connections', connection?.strategy, {
    manual: true,
  });
  const { data: enabled_clients, run: fetchEnabledClients } = useResourcePagination(ClientEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Application>) => page.items,
  } as any);

  useEffect(() => {
    if (connection) {
      fetchCatalog('enterprise-connections', connection.strategy);
      fetchEnabledClients({
        client_id: (!!connection.enabled_clients && connection.enabled_clients.length > 0) ? connection.enabled_clients : '',
        token_endpoint_auth_method: 'none',
        fields: 'client_id,name,app_type,logo_uri',
      });
    }
  }, [connection]);

  const handleUpdate = useCallback(async (data: Partial<API.Connection>): Promise<boolean> => {
    console.log('update value: ', data);
    await update(id, data);

    message.success('保存成功');
    await refresh();

    return true;
  }, [connection]);

  const handleDeleteConnection = useCallback(async (id: string) => {
    await deleteConnection(id);

    history.push(formatPath('/connections/enterprise'));
  }, [connection]);

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
    const tabRenderMap = gTabRenderMap[strategy] || defaultTabRenderMap;
    const render = tabRenderMap[key];
    return render({ 
      connection, 
      onUpdate: handleUpdate, 
      onDelete: handleDeleteConnection,
    });
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
      tabList={tabList}
      tabActiveKey={tab}
      onTabChange={(key: string) => {
        history.push(formatPath(`/connections/enterprise/${connection.strategy}/${connection.id}/${key}`));
      }}
      extra={
        <Dropdown.Button loading={!tenantSettings} size="large" icon={<CaretRightOutlined/>} overlay={testOverlay}>测试</Dropdown.Button>
      }
    >
      <Card bordered={false}>
        {renderTab(tab)}
      </Card>
    </PageContainer>
  );
}

export default EnterpriseConnectionDetailsPage;