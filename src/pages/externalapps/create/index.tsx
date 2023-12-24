import React, { useCallback, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Breadcrumb, Space, Button } from 'antd';
import { history, Link } from 'umi';
import { useMarketplaceCatalogDetails } from '@/hooks/marketplace-catalog';
import Avatar from 'antd/lib/avatar/avatar';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import * as _ from 'lodash';
import { formatPath } from '@/utils/link.utils';
import ExternalAppEditForm from '../components/ExternalAppEditForm';
import { ClientEntity } from '@/api';
import { useResourceCreate } from '@/hooks/useResource';

export default function ({ match }) {
  const { catalog_id } = match.params;

  const { data: catalog, loading } = useMarketplaceCatalogDetails('sso-integrations', catalog_id);

  const { run: create } = useResourceCreate(ClientEntity);

  const [view, setView] = useState('license');

  const handleCreate = useCallback(async (application: API.Application): Promise<boolean> => {
    await create(application);

    history.push(formatPath(`/app/externalapps`));
    return true;
  }, []);

  const licenseView = ( <Card bordered={false} loading={loading} style={{ width: '100%' }}>
    <Row justify="center">
      <Card style={{ width: '800px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <h2 style={{ fontSize: 24 }}>{catalog?.metaTitle}</h2>
            <span>{catalog?.name}需要访问:</span>
          </div>
          <ProCard bordered={true} split="horizontal">
            <ProCard>接受来自{catalog?.companyName}的登录请求</ProCard>
            <ProCard>向{catalog?.companyName}分享用户信息</ProCard>
          </ProCard>
          <Row justify="center">
            <Space>
              <Button type="primary" size="large" onClick={() => setView('form')}>继续</Button>
              <Button size="large" onClick={() => history.push(formatPath('/connections/social/create'))}>取消</Button>
            </Space>
          </Row>
          <Row justify="center">
            <span style={{ color: '#65676e'}}>继续代表您授予集成访问给到集成商，并同意集成商的<a>使用条款</a>和<a>隐私条款</a>. 同样代表您同意 Authok 的<a>应用市场条款</a>.</span>
          </Row>
        </Space>
      </Card>
    </Row>
  </Card>);

  const formView = <ExternalAppEditForm schemaNamespace="sso-integrations" schemaKey={catalog_id} onFinish={handleCreate} />;

  return (
    <PageContainer 
      pageHeaderRender={false}
      className="page-middle"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Breadcrumb style={{ color: '#65676e'}}>
            <Breadcrumb.Item>
              <Link to={formatPath('/app/externalapps/create')}><ArrowLeftOutlined /> 选择 SSO 集成</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Space size="large">
            <Avatar shape="square" size={42} src={catalog?.icon} />
            <span style={{ fontSize: 32 }}><b>{catalog?.name}</b></span>
          </Space>
        </Space>
        {view === 'form' ? formView : licenseView }
      </Space>
    </PageContainer>
  );
};