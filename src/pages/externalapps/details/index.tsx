import React, { useCallback, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import { notification, Card, Space, Typography, Avatar, Row, Col, Button, Empty } from 'antd';
import { formatPath } from '@/utils/link.utils';
import { useResourceDetails, useResourceDelete, useResourceUpdate } from '@/hooks/useResource';
import ProSkeleton from '@ant-design/pro-skeleton';
import { ClientEntity } from '@/api';
import ConnectionSettings from '@/pages/application/details/components/ConnectionSettings';
import ExternalAppSettings from './components/ExternalAppSettings';
import ProCard from '@ant-design/pro-card';
import { useMarketplaceCatalogDetails } from '@/hooks/marketplace-catalog';
import { CaretRightOutlined } from '@ant-design/icons';
import { useAuthok } from '@authok/authok-react';
const { Text } = Typography;

export default function({ match }) {
  const { id, tab = 'settings' } = match.params;
  const { data: application, loading, error, refresh } = useResourceDetails(ClientEntity, id);
  const { run: updateApplication } = useResourceUpdate(ClientEntity);
  const { run: deleteApplication, loading: loadingDelete } = useResourceDelete(ClientEntity);
  const { data: catalog, run: loadCatalog } = useMarketplaceCatalogDetails('sso-integrations', application?.app_type, {
    manual: true,
  }); 
  const { getIdTokenClaims } = useAuthok();

  useEffect(() => {
    if (application) {
      loadCatalog('sso-integrations', application.app_type);
    }
  }, [application]);

  const handleUpdateApplication = useCallback(async (values: Partial<API.Application>): Promise<boolean> => {
    await updateApplication(id, values);
    notification.success({
      key: 'application.update',
      message: '更新成功',
    });

    refresh();

    return true;
  }, [id, application]);

  const handleDeleteApplication = useCallback(async (id: string): Promise<boolean> => {
    await deleteApplication(id);
  
    history.push(formatPath('/app/externalapps'));
    return true;
  }, [id, application]);

  const handleTest = useCallback(async () => {
    const claims = await getIdTokenClaims();
    if (!claims) return;

    if (application && !!application.addons.samlp) {
      const url = `${claims.iss}samlp/${application.client_id}`;
      window.open(url);
    }
  }, [application]);

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
        <Link to={formatPath('/app/externalapps')}><Button type="primary">返回</Button></Link>
      </Empty>
    </PageContainer>
  }

  return <PageContainer  className="page-middle">
    <ProCard>
      <Card.Meta
        avatar={<Avatar shape="square" src={catalog?.icon} size={64}/>}
        title={application.name}
        description={
          <Row justify="center" gutter={16} style={{ width: '100%' }}>
            <Col span={5}>{catalog?.name}</Col>
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
                !!application && (
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
        onChange: (key: string) => {
          history.push(formatPath(`/app/externalapps/${application.client_id}/${key}`));
        },
        tabBarGutter: 64,
        size: 'large',
    }}>
      <ProCard.TabPane key="settings" tab="设置">
        <ExternalAppSettings application={application} onUpdate={handleUpdateApplication} onDelete={handleDeleteApplication} loadingDelete={loadingDelete}/>
      </ProCard.TabPane>
      <ProCard.TabPane key="connections" tab="身份源">
        <ConnectionSettings application={application} />
      </ProCard.TabPane>
      <ProCard.TabPane key="tutorial" tab="使用说明">
        tutorial
      </ProCard.TabPane>
    </ProCard>  
  </PageContainer>
}