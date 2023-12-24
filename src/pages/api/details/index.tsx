import React, { useState, useCallback, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import Avatar from 'antd/lib/avatar/avatar';
import Meta from 'antd/lib/card/Meta';
import { message, Typography, Row, Col, Space, Badge, Tag, Empty } from 'antd';
import ResourceServerQuickStart from './components/ResourceServerQuickStart';
import ResourceServerSettings from './components/ResourceServerSettings';
import { history, Route } from 'umi';
import PermissionSettings from './components/PermissionSettings';
import ApiTest from './components/ApiTest';
import M2MAppSettings from './components/M2MAppSettings';
import { useResourceDetails, useResourceUpdate, useResourceDelete } from '@/hooks/useResource';
import { ResourceServerEntity } from '@/api/entities/resource-server.entity';
const { Text } = Typography;
import ProSkeleton from '@ant-design/pro-skeleton';
import ApiExplorer from './components/ApiExplorer';
import { formatPath } from '@/utils/link.utils';

const ResourceServerDetailsPage: React.FC<any> = ({ match }) => {
  const { id, tab: _tab } = match.params;
  const [tab, setTab] = useState(_tab || 'quickstart');
  useEffect(() => {
    setTab(_tab);
  }, [_tab]);

  const { data: resourceServer, loading, refresh, error } = useResourceDetails(ResourceServerEntity, id);
  const { run: update, loading: loadingUpdate } = useResourceUpdate(ResourceServerEntity);
  const { run: deleteResourceServer } = useResourceDelete(ResourceServerEntity);

  const handleUpdate = useCallback(async (values: Partial<API.ResourceServer>) => {
    await update(id, values);
    message.success('更新成功');

    refresh();

    return true;
  }, [resourceServer]);

  const handleDelete = useCallback(async (id: string): Promise<boolean> => {
    await deleteResourceServer(id);
    
    history.push(formatPath('/app/apis'));

    return true;
  }, []);

  if (loading && !resourceServer) {
    return <PageContainer><ProSkeleton type="descriptions" error={error}/></PageContainer>
  }

  if (!resourceServer) {
    return <PageContainer><Empty /></PageContainer>
  }

  return <PageContainer>
    <ProCard>
      <Meta
        avatar={<Avatar src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg" size={64}/>}
        title={resourceServer?.name}
        description={
          <Row justify="center" gutter={16} style={{ width: '520px' }}>
            <Col span={4}>{resourceServer?.is_system ? '系统API' : '自定义API' }</Col>
            <Col span={20}>
              <Space>
                <Text>Audience</Text> 
                <Text keyboard>
                  {resourceServer?.identifier}
                </Text>
              </Space>
            </Col>
          </Row>
        }
      />
    </ProCard>

    <ProCard
      tabs={{
        // destroyInactiveTabPane: true,
        tabPosition: 'top',
        activeKey: tab,
        onChange: (key) => {
          // setTab(key);
          history.push(formatPath(`/app/apis/${resourceServer.id}/${key}`));
        },
        tabBarGutter: 64,
        size: 'large',
    }}>
      <ProCard.TabPane key="quickstart" tab="快速开始">
        <ResourceServerQuickStart resourceServer={resourceServer} />
      </ProCard.TabPane>
      <ProCard.TabPane key="settings" tab="设置">
        <ResourceServerSettings 
          resourceServer={resourceServer}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </ProCard.TabPane>
      <ProCard.TabPane key="permissions" tab="权限">
        <Route path={formatPath(`/app/apis/${resourceServer.id}/permissions`)}>
          <PermissionSettings loading={loading} loadingUpdate={loadingUpdate} resourceServer={resourceServer} onUpdate={handleUpdate}/>
        </Route>
      </ProCard.TabPane>
      <ProCard.TabPane key="non_interactive" tab="M2M应用授权">
        <Route path={formatPath(`/app/apis/${resourceServer.id}/non_interactive`)}>
          <M2MAppSettings resourceServer={resourceServer} refresh={refresh}/>
        </Route>
      </ProCard.TabPane>
      <ProCard.TabPane key="test" tab="测试">
        <ApiTest resourceServer={resourceServer} />
        <Route path={formatPath(`/app/apis/${resourceServer.id}/test`)}>
        </Route>
      </ProCard.TabPane>
      {
        resourceServer.is_system && <ProCard.TabPane key="api_explorer" tab="API浏览">
          <ApiExplorer resourceServer={resourceServer} />
        </ProCard.TabPane>
      }

    </ProCard>
  </PageContainer>;
}

export default ResourceServerDetailsPage;