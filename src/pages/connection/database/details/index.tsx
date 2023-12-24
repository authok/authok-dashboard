import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Avatar, Typography, Col, Row, Space, Menu, message, Spin, Empty, Dropdown } from 'antd';
const { Text } = Typography;
import Meta from 'antd/lib/card/Meta';
import ConnectionSettings from '@/pages/connection/database/details/components/ConnectionSettings';
import ApplicationSettings from '../../components/ApplicationSettings';
import { CaretRightOutlined } from '@ant-design/icons';
import { useSessionStorageState } from '@umijs/hooks';
import { AuthokClient } from '@authok/authok-spa-js';
import * as _ from 'lodash';
import CustomDatabaseSettings from '../components/CustomDatabaseSettings';
import PasswordPolicy from '../components/PasswordPolicy';
import { history, useIntl } from 'umi';
import ProSkeleton from '@ant-design/pro-skeleton';
import { useResourceDetails, useResourceUpdate, useResourceDelete, useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity, ClientEntity } from '@/api';
import { useTenantDetails } from '@/hooks/tenant';
import { formatPath } from '@/utils/link.utils';

export const ConnectionDetails: React.FC<any> = ({ match }) => {
  const { id, tab: _tab } = match.params;
  const [tab, setTab] = useState(_tab || 'settings');

  const { formatMessage } = useIntl();

  const { error, data: connection, loading, refresh } = useResourceDetails(ConnectionEntity, id);
  const { run: update, loading: loadingUpdate } = useResourceUpdate(ConnectionEntity);
  const { run: deleteConnection } = useResourceDelete(ConnectionEntity);
  const { data: tenantSettings } = useTenantDetails();
  const { data: enabled_clients, run: fetchEnabledClients } = useResourcePagination(ClientEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Application>) => page.items,
  } as any);

  useEffect(() => {
    if (connection) {
      fetchEnabledClients({
        client_id: connection?.enabled_clients,
        token_endpoint_auth_method: 'none',
        fields: 'client_id,name,app_type',
      });
    }
  }, [connection]);

  const handleUpdate = useCallback(async (data: Partial<API.Connection>) => {
    await update(id, data);

    message.success('保存成功');
    await refresh();
  }, [id, connection]);

  const handleDeleteConnection = useCallback(async (id: string) => {
    await deleteConnection(id);

    history.push(formatPath('/connections/database'));
  }, [connection]);

  const testOverlay = useMemo(() => <Menu>
    {enabled_clients?.map(it => (
      <Menu.Item key={it.client_id} onClick={() => handleTry(it.client_id)}>{it.name}</Menu.Item>
    ))}
  </Menu>, [enabled_clients]);

  const [_testerParams, setTesterParams] = useSessionStorageState<Record<string, any>>('tester_params');
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

  if (loading && !connection) {
    return <PageContainer><ProSkeleton /></PageContainer>;
  }

  if (!connection) {
    return <PageContainer><Empty /></PageContainer>;
  }

  return (
    <PageContainer error={error} className="page-middle">
      <Spin delay={500} spinning={loading}>
        <ProCard>
          <Meta
            avatar={<Avatar src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg" size={64}/>}
            title={<h2>{ connection?.display_name || connection?.name}</h2>}
            description={
              <>
                <Row justify="center" gutter={16}>
                  <Col span={20}>
                    <Space size="middle">
                      <Text>{formatMessage({ id: `app.settings.connection.strategy.${connection.strategy}` })}</Text>
                      <Text>ID</Text> 
                      <Text keyboard>
                        {connection?.id}
                      </Text>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Row style={{ justifyItems:'end' }}>
                      <Dropdown.Button loading={!tenantSettings} size="large" icon={<CaretRightOutlined/>} overlay={testOverlay}>测试</Dropdown.Button>
                    </Row>
                  </Col>
                </Row>
              </>
            }
          />
        </ProCard>

        <ProCard        
          style={{ paddingLeft: '16px', paddingRight: '16px' }}
          tabs={{
            tabPosition: 'top',
            activeKey: _tab,
            onChange: (key) => {
              history.push(formatPath(`/connections/database/${connection.id}/${key}`));
            },
            tabBarGutter: 64,
            size: 'large',
        }}>
          <ProCard.TabPane key="settings" tab="设置">
            <ConnectionSettings connection={connection} onUpdate={handleUpdate} onDelete={handleDeleteConnection}/>
          </ProCard.TabPane>
          <ProCard.TabPane key="password_policy" tab="密码策略">
            <PasswordPolicy connection={connection} onUpdate={handleUpdate} />
          </ProCard.TabPane>
          <ProCard.TabPane key="custom_database" tab="自定义数据库">
            <CustomDatabaseSettings connection={connection} onUpdate={handleUpdate} loading={loadingUpdate} />
          </ProCard.TabPane>
          <ProCard.TabPane key="applications" tab="关联应用">
            <ApplicationSettings connection={connection} onUpdate={handleUpdate} />
          </ProCard.TabPane>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default ConnectionDetails;