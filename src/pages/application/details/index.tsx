import React, { useState, useCallback } from 'react';
import ProSkeleton from '@ant-design/pro-skeleton';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import Meta from 'antd/lib/card/Meta';
import { message, Avatar, Row, Col, Space, Empty, Button, Typography, notification } from 'antd';
import AppSettings from './components/AppSettings';
import QuickStart from './components/QuickStart';
const { Text } = Typography;
import { ConnectionSettings } from './components/ConnectionSettings';
import ApiSettings from './components/ApiSettings';
import { history, Link, useIntl } from 'umi';
import { useResourceDetails, useResourceUpdate, useResourceDelete } from '@/hooks/useResource';
import { ClientEntity } from '@/api';
import { formatPath } from '@/utils/link.utils';
import { useTenantDetails } from '@/hooks/tenant';
import { CaretRightOutlined } from '@ant-design/icons';
import { useSessionStorageState } from '@umijs/hooks';
import { AuthokClient } from '@authok/authok-spa-js';
import AddonSettings from './components/addon';

const ApplicationDetailsPage: React.FC<any> = ({ match }) => {
  const { id, tab = 'settings' } = match.params;

  const { formatMessage } = useIntl();

  const { data: tenant } = useTenantDetails();
  const { error, data: application, loading, refresh } = useResourceDetails(ClientEntity, id);
  const { run: updateApplication } = useResourceUpdate(ClientEntity);
  const { run: deleteApplication, loading: loadingDelete } = useResourceDelete(ClientEntity);
  

  const handleUpdateApplication = useCallback(async (values: Partial<API.Application>) => {
    await updateApplication(id, values);
    message.success('更新成功');

    refresh();

    return true;
  }, [id, application]);

  const handleDeleteApplication = useCallback(async (id: string): Promise<boolean> => {
    await deleteApplication(id);
  
    history.push(formatPath('/app/applications'));
    return true;
  }, [id, application]);

  const [_testerParams, setTesterParams] = useSessionStorageState<Record<string, any>>('tester_params');

  const handleTest = async () => {
    if (!tenant) return;

    const redirect_uri = `${window.location.origin}/connections/tester/callback`;

    setTesterParams({
      domain: tenant.domain,
      client_id: application.client_id,
    });

    const authokClient = new AuthokClient({
      domain: tenant.domain,
      client_id: application.client_id,
      cacheLocation: 'localstorage',
    });

    const url = await authokClient.buildAuthorizeUrl({
      scope: 'openid email profile',
      redirect_uri,
    });

    window.open(url);
  };

  if (loading && !application) {
    return <PageContainer><ProSkeleton type="descriptions" error={error}/></PageContainer>;
  }

  if (!application) {
    return <PageContainer>
      <Empty 
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>记录不存在</span>
        }
      >
        <Link to={formatPath('/app/applications')}><Button type="primary">返回</Button></Link>
      </Empty>
    </PageContainer>
  }

  return <PageContainer className="page-middle">
    <ProCard>
      <Meta
        avatar={<Avatar shape="square" src={application.logo_uri} size={64}/>}
        title={application.name}
        description={
          <Row justify="center" gutter={16} style={{ width: '100%' }}>
            <Col span={5}>{ formatMessage({ id: `app.settings.application.app_type.${application.app_type}` }) }</Col>
            <Col span={15}>
              <Space>
                <Text>Client ID</Text> 
                <Text keyboard>
                  {application.client_id}
                </Text>
              </Space>
            </Col>
            <Col span={4}>
              {
                !!application && application.token_endpoint_auth_method === 'none' && !!tenant && (
                  <Button icon={<CaretRightOutlined />} size="large" target="_blank" onClick={handleTest}>测试</Button>
                )
              }
            </Col>
          </Row>
        }
      />
    </ProCard>

    <ProCard
      tabs={{
        tabPosition: 'top',
        activeKey: tab,
        onChange: (key) => {
          history.push(formatPath(`/app/applications/${id}/${key}`))
        },
        tabBarGutter: 64,
        size: 'large',
    }}>
      <ProCard.TabPane key="quickstart" tab="快速开始">
        <QuickStart application={application} />
      </ProCard.TabPane>
      <ProCard.TabPane key="settings" tab="设置">
        <AppSettings application={application} onUpdate={handleUpdateApplication} onDelete={handleDeleteApplication} loadingDelete={loadingDelete} />
      </ProCard.TabPane>
      <ProCard.TabPane key="addons" tab="插件">
        <AddonSettings application={application} onUpdate={handleUpdateApplication} />
      </ProCard.TabPane>
      { ['spa', 'native', 'web' ].includes(application.app_type) && <ProCard.TabPane key="connections" tab="身份源">
          <ConnectionSettings application={application} />
        </ProCard.TabPane>
      }
      { ['spa', 'native', 'web'].includes(application.app_type) && <ProCard.TabPane key="organizations" tab="组织">
          组织
        </ProCard.TabPane>
      }
      { ['non_interactive'].includes(application.app_type) && <ProCard.TabPane key="apis" tab="API">
          <ApiSettings application={application} refresh={refresh} />
        </ProCard.TabPane>
      }
    </ProCard>
  </PageContainer>;
}

export default ApplicationDetailsPage;